// background.js

// 확장 프로그램이 설치될 때 실행됩니다.
chrome.runtime.onInstalled.addListener(() => {
  // 우클릭 메뉴(컨텍스트 메뉴)에 옵션을 추가합니다.
  chrome.contextMenus.create({
    id: "extractRecipe",
    title: "AI 레시피 추출하기",
    // ✨ 수정: 'selection'을 추가하여 선택한 텍스트 위에서도 메뉴가 나타나도록 설정
    contexts: ["page", "video", "link", "selection"] 
  });
});

// 우클릭 메뉴가 클릭되었을 때 실행됩니다.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // 우리가 만든 메뉴(extractRecipe)가 맞는지 확인합니다.
  if (info.menuItemId === "extractRecipe") {
    // ✨ 수정: 하드코딩된 주소 대신 chrome.storage에서 서버 주소를 불러옵니다.
    chrome.storage.sync.get({
      serverUrl: '' // 기본값은 비워둡니다.
    }, (items) => {
      const appBaseUrl = items.serverUrl;

      // 서버 주소가 설정되지 않았다면, 사용자에게 알리고 옵션 페이지를 엽니다.
      if (!appBaseUrl || appBaseUrl.trim() === "") {
        alert('AI 레시피 추출기 서버 주소가 설정되지 않았습니다. 옵션 페이지에서 설정해주세요.');
        chrome.runtime.openOptionsPage(); // 옵션 페이지 열기
        return;
      }

      // ✨ 수정: 클릭된 대상에 따라 URL을 결정 (링크 > 선택된 텍스트 > 페이지 순)
      const urlToProcess = info.linkUrl || info.selectionText || info.pageUrl;
      const youtubeRegex = /youtube\.com|youtu\.be/;

      if (urlToProcess && youtubeRegex.test(urlToProcess)) {
        // Flask 앱으로 보낼 최종 URL을 만듭니다.
        const targetUrl = `${appBaseUrl}/ext_extract?url=${encodeURIComponent(urlToProcess)}`;
        
        // 새 탭에서 해당 URL을 엽니다.
        chrome.tabs.create({ url: targetUrl });
      } else {
        console.log("유튜브 URL을 찾을 수 없습니다:", urlToProcess);
        alert("선택한 텍스트나 링크가 유효한 유튜브 주소가 아닙니다.");
      }
    });
  }
});