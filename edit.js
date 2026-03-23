document.addEventListener('DOMContentLoaded', () => {
    const keyList = [
      'prevKey', 'nextKey', 'prevPageKey', 'nextPageKey', 'scrollTopKey',
      'writeKey', 'commentKey',
      'likeKey', 'dislikeKey', 'bestKey', 'enabled'
    ];
  
    chrome.storage.sync.get(keyList, (data) => {
      keyList.forEach(key => {
        const input = document.getElementById(`${key}Input`);
        if (input) {
          if (input.type === 'checkbox') {
            input.checked = data[key] !== false;
          } else {
            input.value = data[key] || getDefaultKey(key);
          }
        }
      });
      
      // 토글 상태 로드 (input type 체크로 통합 처리됨)
      const toggle = document.getElementById('enabledToggle');
      if (toggle) {
        toggle.checked = data.enabled !== false;
      }
    });
  
    document.getElementById('saveButton').addEventListener('click', () => {
      const newData = {};
      const used = new Set();
  
      for (const key of keyList) {
        const input = document.getElementById(`${key}Input`);
        if (input.type === 'checkbox') {
          newData[key] = input.checked;
          continue;
        }
        
        const value = input.value.trim().toLowerCase();
        if (!/^[a-z0-9]$/.test(value)) {
          alert('영문 또는 숫자 한 글자로만 설정 가능합니다.');
          return;
        }
        if (used.has(value)) {
          alert('모든 단축키는 서로 달라야 합니다.');
          return;
        }
        used.add(value);
        newData[key] = value;
      }
  
      chrome.storage.sync.set(newData, () => {
        alert('단축키가 저장되었습니다.');
        window.location.href = 'default.html';
      });
    });
  
    document.getElementById('cancelButton').addEventListener('click', () => {
      window.location.href = 'default.html';
    });
  
    keyList.forEach(id => {
      const input = document.getElementById(`${id}Input`);
      if (input) input.addEventListener('focus', () => input.select());
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