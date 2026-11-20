// Tasky: a small task list, saved in this browser.
const STORAGE_KEY = "tasky.tasks";

const form = document.getElementById("new-task");
const input = document.getElementById("task-title");
const list = document.getElementById("task-list");
const empty = document.getElementById("empty");
const count = document.getElementById("count");
const clearDone = document.getElementById("clear-done");
const filterButtons = document.querySelectorAll("[data-filter]");

let tasks = load();
let filter = "all";

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch {
    // Storage blocked or broken: start with the sample tasks.
  }
  return [
    { id: 1, title: "Plan the week", done: true },
    { id: 2, title: "Write the release notes", done: false },
  ];
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage blocked: the list still works until the page reloads.
  }
}

function render(newId) {
  const shown = tasks.filter((t) => filter === "all" || (filter === "done" ? t.done : !t.done));
  list.replaceChildren(
    ...shown.map((task) => {
      const item = document.createElement("li");
      item.className = [task.done && "done", task.id === newId && "new"].filter(Boolean).join(" ");

      const box = document.createElement("input");
      box.type = "checkbox";
      box.id = `task-${task.id}`;
      box.checked = task.done;
      box.addEventListener("change", () => {
        task.done = box.checked;
        save();
        render();
      });

      const label = document.createElement("label");
      label.htmlFor = box.id;
      label.textContent = task.title;

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete";
      remove.textContent = "Delete";
      remove.setAttribute("aria-label", `Delete ${task.title}`);
      remove.addEventListener("click", () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        save();
        render();
      });

      item.append(box, label, remove);
      return item;
    }),
  );

  empty.hidden = shown.length > 0;
  const left = tasks.filter((t) => !t.done).length;
  count.textContent = `${left} ${left === 1 ? "task" : "tasks"} left`;
  clearDone.disabled = !tasks.some((t) => t.done);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  const id = Date.now();
  tasks.push({ id, title, done: false });
  input.value = "";
  save();
  render(id);
});

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    for (const b of filterButtons) b.setAttribute("aria-pressed", String(b === button));
    render();
  });
}

clearDone.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
});

render();
