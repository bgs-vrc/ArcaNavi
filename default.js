document.addEventListener('DOMContentLoaded', () => {
	const keys = [
	  'prevKey', 'nextKey', 'prevPageKey', 'nextPageKey', 'scrollTopKey',
	  'writeKey','commentKey',
	  'likeKey', 'dislikeKey', 'bestKey', 'enabled'
	];
  
	chrome.storage.sync.get(keys, (data) => {
	  keys.forEach(key => {
		const input = document.getElementById(`${key}Input`);
		if (input) input.value = data[key] || getDefaultKey(key);
	  });
	  
	  // 토글 상태 로드
	  const toggle = document.getElementById('enabledToggle');
	  if (toggle) {
		toggle.checked = data.enabled !== false; // 기본값은 true
	  }
	});

	// 토글 상태 변경 시 자동 저장
	document.getElementById('enabledToggle').addEventListener('change', (e) => {
	  chrome.storage.sync.set({ enabled: e.target.checked });
	});
  
	document.getElementById('editButton').addEventListener('click', () => {
	  window.location.href = 'edit.html';
	});
  });
  
  function getDefaultKey(key) {
	const defaults = {
	  prevKey: 'z', nextKey: 'x', prevPageKey: 'a', nextPageKey: 's',
	  scrollTopKey: 'q', writeKey: 'w',
	  commentKey: 'c',
	  likeKey: 'v', dislikeKey: 'f', bestKey: 'd'
	};
	return defaults[key] || '';
  }
  