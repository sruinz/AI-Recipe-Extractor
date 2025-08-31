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
    // ✨ 수정: 클릭된 대상에 따라 URL을 결정 (링크 > 선택된 텍스트 > 페이지 순)
    const urlToProcess = info.linkUrl || info.selectionText || info.pageUrl;

    // 여러분의 Flask 애플리케이션 주소로 변경해야 합니다.
    // Docker에서 실행 중이라면, Docker 컨테이너가 노출된 호스트 IP와 포트를 사용하세요.
    // 예: http://192.168.0.10:5000
    const appBaseUrl = "http://192.168.0.10:8083";

    // 유튜브 URL이 맞는지 간단하게 확인합니다.
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
  }
});