/* Course data container + tiny helpers used by the content files to write lesson HTML. */
window.COURSE = {
  modules: [],
  glossary: [],
  labs: [],
  scenarios: [],
  scorecard: [],
  plan: [],
  questions: []
};

window.H = (function () {
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  var labels = { j2: 'At J2', verify: 'Verify on day one', warn: 'Watch out', tip: 'Try this' };
  return {
    esc: esc,
    flow: function (steps) {
      return '<div class="flow" role="list">' + steps.map(function (s) {
        return '<span class="flow-step" role="listitem">' + s + '</span>';
      }).join('<span class="flow-arrow" aria-hidden="true">→</span>') + '</div>';
    },
    table: function (head, rows) {
      return '<div class="table-wrap"><table><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') +
        '</tr></thead><tbody>' + rows.map(function (r) {
          return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>';
    },
    note: function (kind, html) {
      return '<aside class="callout callout-' + kind + '"><span class="callout-label">' + (labels[kind] || kind) + '</span>' + html + '</aside>';
    },
    code: function (src, lang) {
      return '<pre class="code" data-lang="' + (lang || '') + '"><code>' + esc(src.replace(/^\n/, '')) + '</code></pre>';
    }
  };
})();
