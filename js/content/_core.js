/* Course data container + small helpers used by the content files. */
window.COURSE = { modules: [], glossary: [], areas: [], scorecard: [], scorecardAreas: [], questions: [], phrases: [], pitch: '' };

window.H = (function () {
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
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
    }
  };
})();
