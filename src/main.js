const hasMatches = (arr, value) => arr.reduce(
  (memo, current) => (
    memo || new RegExp(current).test(value)
  ),
  false
);

export default function() {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        // if there are paths, and any of them match this file name don't exit
        if (state.opts.paths && !hasMatches(state.opts.paths, state.file.opts.filename)) {
          return;
        }

        // if this module is an exception - return
        if (
          state.opts.moduleExceptions &&
          hasMatches(state.opts.moduleExceptions, path.node.source.value)
        ) {
          return;
        }

        // prepend lazy
        path.node.source.value = `bundle-loader?lazy!${path.node.source.value}`;
      }
    }
  };
};
