/* Decode the *displayed* text of the permalink inside Butterfly's post
 * copyright box so Chinese paths read as characters (e.g. 公开知识库) instead
 * of percent-encoded gibberish (%E5%85%AC%E5%BC%80...).
 *
 * Only the visible <a> text node is rewritten; the href attribute is left
 * untouched so the link still works even when the path contains '&', spaces,
 * or other URL-significant characters.
 */
(function () {
  'use strict';

  function decodeLinkText(anchor) {
    try {
      var raw = anchor.textContent || '';
      var decoded = decodeURIComponent(raw);
      if (decoded && decoded !== raw) {
        anchor.textContent = decoded;
      }
    } catch (e) {
      /* malformed URI sequence — leave the original text as-is */
    }
  }

  function processCopyrightLinks(root) {
    var scope = root || document;
    // Target only the permalink shown in the post copyright block.
    var links = scope.querySelectorAll('.post-copyright a[href]');
    links.forEach(decodeLinkText);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      processCopyrightLinks();
    });
  } else {
    processCopyrightLinks();
  }

  /* Re-run after pjax navigation, if pjax is enabled. */
  document.addEventListener('pjax:success', function () {
    processCopyrightLinks();
  });
})();
