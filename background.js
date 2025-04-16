chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getKeys') {
      chrome.storage.sync.get(
        [
          'prevKey',         // 이전 글
          'nextKey',         // 다음 글
          'prevPageKey',     // 이전 페이지
          'nextPageKey',     // 다음 페이지
          'scrollTopKey',    // 맨 위로
          'writeKey',        // 글쓰기 + 글작성
          'commentKey',      // 댓글 + 댓글작성
          'likeKey',         // 추천
          'dislikeKey',      // 비추천
          'bestKey'          // 개념글 페이지 이동
        ],
        (data) => {
          sendResponse({
            prevKey: data.prevKey || 'z',
            nextKey: data.nextKey || 'x',
            prevPageKey: data.prevPageKey || 'a',
            nextPageKey: data.nextPageKey || 's',
            scrollTopKey: data.scrollTopKey || 'q',
            writeKey: data.writeKey || 'w',
            commentKey: data.commentKey || 'c',
            likeKey: data.likeKey || 'v',
            dislikeKey: data.dislikeKey || 'f',
            bestKey: data.bestKey || 'd'
          });
        }
      );
      return true; // async 응답
    }
  });
  