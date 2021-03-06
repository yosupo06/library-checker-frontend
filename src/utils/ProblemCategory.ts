import { Problem } from "../api/library_checker_pb";

const categories = [
  {
    name: "Sample",
    problems: ["aplusb", "many_aplusb"],
  },

  {
    name: "Data Structure",
    problems: [
      "associative_array",
      "unionfind",
      "static_range_sum",
      "staticrmq",
      "point_add_range_sum",
      "point_set_range_composite",
      "range_affine_range_sum",
      "range_chmin_chmax_add_range_sum",
      "range_kth_smallest",
      "vertex_add_path_sum",
      "vertex_set_path_composite",
      "vertex_add_subtree_sum",
      "dynamic_sequence_range_affine_range_sum",
      "dynamic_tree_vertex_add_path_sum",
      "dynamic_tree_vertex_set_path_composite",
      "dynamic_tree_vertex_add_subtree_sum",
      "dynamic_tree_subtree_add_subtree_sum",
      "dynamic_graph_vertex_add_component_sum",
      "set_xor_min",
      "line_add_get_min",
      "segment_add_get_min",
      "queue_operate_all_composite",
      "static_range_inversions_query",
      "rectangle_sum",
      "point_add_rectangle_sum",
      "persistent_queue",
      "persistent_unionfind",
    ],
  },

  {
    name: "Graph",
    problems: [
      "cycle_detection",
      "shortest_path",
      "scc",
      "k_shortest_walk",
      "two_edge_connected_components",
      "three_edge_connected_components",
      "min_cost_b_flow",
      "bipartitematching",
      "general_matching",
      "bipartite_edge_coloring",
      "assignment",
      "directedmst",
      "manhattanmst",
      "dominatortree",
      "maximum_independent_set",
      "chromatic_number",
      "enumerate_triangles",
      "tree_decomposition_width_2",
      "global_minimum_cut_of_dynamic_star_augmented_graph",
      "chordal_graph_recognition",
    ],
  },

  {
    name: "Tree",
    problems: [
      "tree_diameter",
      "lca",
      "cartesian_tree",
      "frequency_table_of_tree_distance",
    ],
  },

  {
    name: "Math",
    problems: [
      "counting_primes",
      "enumerate_primes",
      "factorize",
      "multipoint_evaluation",
      "polynomial_interpolation",
      "inv_of_formal_power_series",
      "exp_of_formal_power_series",
      "log_of_formal_power_series",
      "pow_of_formal_power_series",
      "sqrt_of_formal_power_series",
      "composition_of_formal_power_series",
      "inv_of_polynomials",
      "stirling_number_of_the_first_kind",
      "stirling_number_of_the_second_kind",
      "bernoulli_number",
      "partition_function",
      "polynomial_taylor_shift",
      "montmort_number_mod",
      "sum_of_totient_function",
      "sum_of_exponential_times_polynomial",
      "sum_of_exponential_times_polynomial_limit",
      "find_linear_recurrence",
      "sum_of_floor_of_linear",
      "sqrt_mod",
      "kth_root_mod",
      "kth_root_integer",
      "discrete_logarithm_mod",
      "tetration_mod",
      "nim_product_64",
      "sharp_p_subset_sum",
      "two_sat",
    ],
  },

  {
    name: "Convolution",
    problems: [
      "convolution_mod",
      "convolution_mod_1000000007",
      "convolution_mod_2_64",
      "subset_convolution",
      "bitwise_and_convolution",
      "bitwise_xor_convolution",
      "multivariate_convolution",
    ],
  },

  {
    name: "Matrix",
    problems: [
      "matrix_product",
      "matrix_det",
      "sparse_matrix_det",
      "system_of_linear_equations",
      "hafnian_of_matrix",
    ],
  },

  {
    name: "String",
    problems: [
      "zalgorithm",
      "enumerate_palindromes",
      "suffixarray",
      "number_of_substrings",
      "runenumerate",
    ],
  },

  {
    name: "Geometry",
    problems: ["sort_points_by_argument", "convex_layers"],
  },
];

export const getCategories = (
  problems: Problem[]
): {
  name: string;
  problems: {
    name: string;
    title: string;
  }[];
}[] => {
  const classifiedSet = new Set(categories.map((e) => e.problems).flat());
  const problemNames = problems.map((e) => e.getName());
  const nameToTitle = problems.reduce<{ [name: string]: string }>(
    (dict, problem) => {
      dict[problem.getName()] = problem.getTitle();
      return dict;
    },
    {}
  );

  const problemNameSet = new Set(problemNames);
  const classified = categories.map((e) => ({
    name: e.name,
    problems: e.problems
      .filter((e) => problemNameSet.has(e))
      .map((e) => ({
        name: e,
        title: nameToTitle[e],
      })),
  }));
  const unclassified = problemNames.filter((e) => !classifiedSet.has(e));
  if (unclassified.length) {
    classified.unshift({
      name: "New",
      problems: unclassified.map((e) => ({
        name: e,
        title: nameToTitle[e],
      })),
    });
  }
  return classified;
};
