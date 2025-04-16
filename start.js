chrome.runtime.sendMessage({ action: 'getKeys' }, (keys) => {
  const prevKey = keys.prevKey?.toLowerCase() || 'z';
  const nextKey = keys.nextKey?.toLowerCase() || 'x';
  const prevPageKey = keys.prevPageKey?.toLowerCase() || 'a';
  const nextPageKey = keys.nextPageKey?.toLowerCase() || 's';
  const scrollTopKey = keys.scrollTopKey?.toLowerCase() || 'q';
  const writeKey = keys.writeKey?.toLowerCase() || 'w';
  const commentKey = keys.commentKey?.toLowerCase() || 'c';
  const likeKey = keys.likeKey?.toLowerCase() || 'v';
  const dislikeKey = keys.dislikeKey?.toLowerCase() || 'f';
  const bestKey = keys.bestKey?.toLowerCase() || 'd';

  document.addEventListener('keydown', async (event) => {
    const key = event.key.toLowerCase();
    const tag = event.target.tagName.toLowerCase();
    const active = document.activeElement;
    const onWritePage = location.href.includes('/write');

    const isCommenting =
      active?.classList.contains('reply-form-textarea') ||
      active?.closest('.reply-form-textarea-wrapper');

    if (event.altKey && key === writeKey) {
      const submitBtn = document.querySelector('#submitBtn');
      if (submitBtn) submitBtn.click();
      return;
    }

    if (event.altKey && key === commentKey) {
      const commentButton = document.getElementById('commentFormButton');
      if (commentButton) commentButton.click();
      return;
    }

    const isTyping = tag === 'input' || tag === 'textarea' || isCommenting || onWritePage;
    if (isTyping) return;

    if (key === scrollTopKey) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (key === writeKey) {
      const board = extractBoardFromUrl(location.href);
      if (board) location.href = `https://arca.live/b/${board}/write`;
      return;
    }

    if (key === commentKey) {
      const replyTextarea = document.querySelector('textarea.reply-form-textarea');
      if (replyTextarea) {
        replyTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        requestAnimationFrame(() => {
          setTimeout(() => {
            ['mousedown', 'mouseup', 'click'].forEach(type => {
              replyTextarea.dispatchEvent(new MouseEvent(type, {
                bubbles: true, cancelable: true, view: window
              }));
            });
            replyTextarea.focus();
            replyTextarea.select?.();
          }, 100);
        });
      }
      return;
    }

    if (key === likeKey) {
      const upBtn = document.querySelector('#rateUp');
      if (upBtn) upBtn.click();
      return;
    }

    if (key === dislikeKey) {
      const downBtn = document.querySelector('#rateDown');
      if (downBtn) downBtn.click();
      return;
    }

    if (key === bestKey) {
  const board = extractBoardFromUrl(location.href);
  if (board) {
    const isBest = location.href.includes("mode=best");
    location.href = isBest
      ? `https://arca.live/b/${board}`
      : `https://arca.live/b/${board}?mode=best`;
  }
  return;
    }

    if (key === prevPageKey || key === nextPageKey) {
      const currentPage = getCurrentPage();
      const newPage = key === prevPageKey ? currentPage - 1 : currentPage + 1;
      const board = extractBoardFromUrl(location.href);
      const isViewingPost = /\/b\/[^/]+\/\d+/.test(location.pathname);

      if (board && newPage >= 1) {
        if (isViewingPost) {
          location.href = `https://arca.live/b/${board}?p=${newPage}`;
        } else {
          location.href = updatePageParam(location.href, newPage);
        }
      }
      return;
    }

    if (key === prevKey || key === nextKey) {
      const rows = Array.from(document.querySelectorAll('.vrow.column, .vrow.hybrid'));
      const filteredRows = rows.filter(row => {
        const cls = row.className;
        return !cls.includes('notice') && !cls.includes('filtered') && !cls.includes('notice-unfilter');
      });

      const currentRow = filteredRows.find(row => row.classList.contains('active'));
      if (!currentRow) return;

      const currentIndex = filteredRows.indexOf(currentRow);
      let targetHref = null;

      const getHref = (row) => {
        if (row.matches('a.vrow.column')) {
          return row.getAttribute('href');
        } else {
          const link = row.querySelector('.vrow-inner a.hybrid-bottom');
          return link?.getAttribute('href') || null;
        }
      };

      const isDeleted = href => href && href.includes("#c_");

      if (key === prevKey) {
        for (let i = currentIndex - 1; i >= 0; i--) {
          const href = getHref(filteredRows[i]);
          if (href && !isDeleted(href)) {
            targetHref = href;
            break;
          }
        }
        if (!targetHref && location.href.match(/\/b\/[^/]+\/\d+/)) {
          const board = extractBoardFromUrl(location.href);
          if (board) location.href = `https://arca.live/b/${board}?p=1`;
          return;
        }
        if (!targetHref && getCurrentPage() > 1) {
          location.href = updatePageParam(location.href, getCurrentPage() - 1) + '#last';
          return;
        }
      }

      if (key === nextKey) {
        for (let i = currentIndex + 1; i < filteredRows.length; i++) {
          const href = getHref(filteredRows[i]);
          if (href && !isDeleted(href)) {
            targetHref = href;
            break;
          }
        }
        if (!targetHref) {
          const nextPage = getCurrentPage() + 1;
          location.href = updatePageParam(location.href, nextPage) + '#first';
          return;
        }
      }

      if (targetHref) {
        location.href = "https://arca.live" + targetHref;
      }
      return;
    }
  });

  if (location.href.includes('/write')) {
    const titleInput = document.getElementById('inputTitle');
    if (titleInput) titleInput.focus();
  }
});

function getCurrentPage() {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get('p') || '1', 10);
}

function updatePageParam(url, newPage) {
  const urlObj = new URL(url);
  urlObj.searchParams.set('p', newPage);
  urlObj.hash = '';
  return urlObj.toString();
}

function extractBoardFromUrl(url) {
  const match = url.match(/\/b\/([^/?#]+)/);
  return match ? match[1] : null;
}

window.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash;
  const rows = Array.from(document.querySelectorAll('.vrow.column, .vrow.hybrid'));
  const filteredRows = rows.filter(row => {
    const cls = row.className;
    return !cls.includes('notice') && !cls.includes('filtered') && !cls.includes('notice-unfilter') && !row.href?.includes("#c_");
  });

  const getHref = (row) => {
    if (row.matches('a.vrow.column')) {
      return row.getAttribute('href');
    } else {
      const link = row.querySelector('.vrow-inner a.hybrid-bottom');
      return link?.getAttribute('href') || null;
    }
  };

  if (hash === '#first' && filteredRows.length > 0) {
    const href = getHref(filteredRows[0]);
    if (href) location.href = "https://arca.live" + href;
  } else if (hash === '#last' && filteredRows.length > 0) {
    const href = getHref(filteredRows[filteredRows.length - 1]);
    if (href) location.href = "https://arca.live" + href;
  }
});
