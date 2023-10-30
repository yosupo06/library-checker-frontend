import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useContext, useRef, useState } from "react";
import { LinkProps, useNavigate, useParams } from "react-router-dom";
import { useLocalStorage } from "react-use";
import {
  useCurrentUser,
  useLangList,
  useProblemInfo,
  useSubmitMutation,
} from "../api/client_wrapper";
import { ProblemInfoResponse } from "../proto/library_checker";
import SourceEditor from "../components/SourceEditor";
import { GitHub, FlashOn, Person } from "@mui/icons-material";
import KatexTypography from "../components/katex/KatexTypography";
import { Container } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { StatementOnHttp } from "../components/Statement";
import { LangContext } from "../contexts/LangContext";
import urlJoin from "url-join";
import NotFound from "./NotFound";
import { Link as RouterLink } from "react-router-dom";
import styled from "@emotion/styled";

const ProblemInfo: React.FC = () => {
  const { problemId } = useParams<"problemId">();
  if (!problemId) {
    return <NotFound />;
  }

  return (
    <Container>
      <ProblemInfoBody problemId={problemId} />
    </Container>
  );
};
export default ProblemInfo;

const ProblemInfoBody: React.FC<{problemId: string}> = (props) => {
  const { problemId } = props;
  const navigate = useNavigate();
  const [source, setSource] = useState("");
  const [progLang, setProgLang] = useLocalStorage("programming-lang", "");
  const lang = useContext(LangContext);

  const problemInfoQuery = useProblemInfo(problemId);
  const langListQuery = useLangList();

  const version = problemInfoQuery.data?.version ?? "";
  const submitProcessing = useRef(false);

  const submitMutation = useSubmitMutation({
    onSuccess: (resp) => {
      navigate(`/submission/${resp.id}`);
    },
  });

  const solveHppQuery = useQuery(
    ["header", problemId],
    () =>
      fetch(
        new URL(
          `${problemId}/${version}/grader/solve.hpp`,
          import.meta.env.VITE_PUBLIC_BUCKET_URL
        )
      ).then((r) => {
        if (r.status == 200) {
          return r.text();
        } else {
          return null;
        }
      }),
    {
      enabled: problemInfoQuery.isSuccess,
    }
  );

  if (problemInfoQuery.isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  if (problemInfoQuery.isError || langListQuery.isError) {
    return (
      <Box>
        <Typography variant="body1">
          Error : {problemInfoQuery.error} {langListQuery.error}
        </Typography>
      </Box>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitProcessing.current) return;
    submitProcessing.current = true;

    if (!progLang) {
      console.log("Please select progLang");
      return;
    }

    submitMutation.mutate({
      lang: progLang,
      problem: problemId,
      source: source,
    });
  };

  console.log(
    urlJoin(import.meta.env.VITE_PUBLIC_BUCKET_URL, `${problemId}/${version}/`)
  );

  console.log("version", version);

  return (
    <Box>
      <KatexTypography variant="h2" paragraph={true}>
        {problemInfoQuery.data.title}
      </KatexTypography>
      <Typography variant="body1" paragraph={true}>
        Time Limit: {problemInfoQuery.data.timeLimit} sec
      </Typography>

      <UsefulLinks problemId={problemId} problemInfo={problemInfoQuery.data} />
      <Divider />

      <StatementOnHttp
        lang={lang?.state.lang ?? "en"}
        baseUrl={
          new URL(
            urlJoin(
              import.meta.env.VITE_PUBLIC_BUCKET_URL,
              `${problemId}/${version}/`
            )
          )
        }
      />

      <Divider
        sx={{
          margin: 1,
        }}
      />
      <Typography variant="h4" paragraph={true}>
        C++(Function) header
      </Typography>

      {solveHppQuery.isSuccess && solveHppQuery.data && (
        <>
          <Typography variant="h6" paragraph={true}>
            solve.hpp
          </Typography>
          <SourceEditor
            value={solveHppQuery.data}
            language="cpp"
            readOnly={true}
            autoHeight={true}
          />
        </>
      )}
      {solveHppQuery.isSuccess && !solveHppQuery.data && (
        <Typography variant="body1" paragraph={true}>
          Unsupported
        </Typography>
      )}

      <Divider
        sx={{
          margin: 1,
        }}
      />

      <Typography variant="h4" paragraph={true}>
        Submit
      </Typography>

      <form onSubmit={(e) => handleSubmit(e)}>
        <FormControl
          sx={{
            height: "400px",
            width: "100%",
          }}
        >
          <SourceEditor
            value={source}
            language={progLang}
            onChange={(e) => {
              setSource(e);
            }}
            readOnly={false}
            autoHeight={false}
          />
        </FormControl>
        <FormControl>
          <Select
            displayEmpty
            required
            value={progLang}
            onChange={(e) => setProgLang(e.target.value as string)}
          >
            <MenuItem value="">Lang</MenuItem>
            {langListQuery.isSuccess &&
              langListQuery.data.langs.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};


const ButtonLink = styled(Button)<LinkProps>()

const UsefulLinks: React.FC<{
  problemInfo: ProblemInfoResponse;
  problemId: string;
}> = (props) => {
  const { problemInfo, problemId } = props;

  const currentUser = useCurrentUser();

  const fastestParams = new URLSearchParams({
    problem: problemId,
    order: "+time",
    status: "AC",
  });

  return (
    <Box>
      {currentUser.isSuccess && currentUser.data.user?.name && (
        <ButtonLink
          LinkComponent={RouterLink}
          variant="outlined"
          startIcon={<Person />}
            to={`/submissions/?${new URLSearchParams({
              problem: problemId,
              user: currentUser.data.user?.name,
              status: "AC",
            }).toString()}`}
        >
          My Submission
        </ButtonLink>
      )}      
      <ButtonLink
        LinkComponent={RouterLink}
        variant="outlined"
        startIcon={<FlashOn />}
        to={`/submissions/?${fastestParams.toString()}`}
      >
        Fastest
      </ButtonLink>
      <Button
        variant="outlined"
        startIcon={<GitHub />}
        href={problemInfo.sourceUrl}
      >
        Github
      </Button>
    </Box>
  );
};

