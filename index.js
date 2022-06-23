'use strict';

(function () {
  var $triangles = document.querySelectorAll('.triangle');
  var template = '<svg class="triangle-svg" viewBox="0 0 140 141">\n    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n      <polygon class="triangle-polygon"  points="70 6 136 138 4 138"></polygon>\n    </g>\n  </svg>';

  Array.prototype.forEach.call($triangles, function ($triangle, index) {
    $triangle.innerHTML = template;
  });
})();