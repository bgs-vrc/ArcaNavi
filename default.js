document.addEventListener('DOMContentLoaded', () => {
	const keys = [
	  'prevKey', 'nextKey', 'prevPageKey', 'nextPageKey', 'scrollTopKey',
	  'writeKey','commentKey',
	  'likeKey', 'dislikeKey', 'bestKey'
	];
  
	chrome.storage.sync.get(keys, (data) => {
	  keys.forEach(key => {
		const input = document.getElementById(`${key}Input`);
		if (input) input.value = data[key] || getDefaultKey(key);
	  });
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
  