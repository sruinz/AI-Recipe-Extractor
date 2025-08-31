// options.js

// '저장' 버튼을 누르면 입력된 서버 주소를 저장하는 함수
function saveOptions() {
  const serverUrl = document.getElementById('serverUrl').value;
  chrome.storage.sync.set({
    serverUrl: serverUrl
  }, () => {
    // 저장 완료 메시지를 잠시 보여줍니다.
    const status = document.getElementById('status');
    status.textContent = '✅ 옵션이 저장되었습니다.';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  });
}

// 옵션 페이지가 열릴 때 저장된 값을 불러와 입력창에 표시하는 함수
function restoreOptions() {
  // 기본값으로 'http://127.0.0.1:8083'을 사용합니다.
  chrome.storage.sync.get({
    serverUrl: 'http://127.0.0.1:8083' // 사용자가 처음 설정할 때를 위한 기본값
  }, (items) => {
    document.getElementById('serverUrl').value = items.serverUrl;
  });
}

// 페이지가 로드되면 저장된 값을 불러오고, 저장 버튼에 클릭 이벤트를 추가합니다.
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);