import "./styles/index.css";

let resetProgress = document.getElementById("reset");

resetProgress.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: resetUdemyCurriculumProgress,
  });
});

function resetUdemyCurriculumProgress() {
  const udemyPage = {
    checkbox: "[data-type='checkbox']",
    checked: "data-checked",
    curriculum: "[data-purpose='curriculum-section-container']",
    lessons: ".unstyled-list",
    lessonProgress: "[data-purpose='progress-toggle-button']",
    panel: "[data-css-toggle-id]",
  };

  function getLessonList(module) {
    const { childNodes } = module.querySelector(udemyPage.lessons);
    return childNodes;
  }

  function getModules() {
    const { childNodes } = document.querySelector(udemyPage.curriculum);
    return childNodes;
  }

  function getModuleData(module) {
    return {
      sectionCheckbox: module.querySelector(udemyPage.checkbox),
      sectionPanel: module.querySelector(udemyPage.panel),
    };
  }

  function isModuleOpen(checkbox) {
    return checkbox.getAttribute(udemyPage.checked) === "checked";
  }

  // TODO: Look up error handling for the case no selector exists
  const lessonModules = getModules();

  lessonModules.forEach((module) => {
    const { sectionCheckbox, sectionPanel } = getModuleData(module);

    if (!isModuleOpen(sectionCheckbox)) {
      sectionPanel.click();
    }

    const lessonList = getLessonList(module);

    lessonList.forEach((lesson) => {
      const button = lesson.querySelector(udemyPage.lessonProgress);

      if (button.checked) {
        button.click();
      }
    });
  });
}
