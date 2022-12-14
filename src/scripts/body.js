import tasks from "./coordinator";
import "./../styles/body.css";
import { differenceInWeeks, differenceInCalendarMonths } from "date-fns";

import Trash from "./../assets/trash.png";
import { updateBody, updateSidebar } from "./updateDOM";

export default function createBody(project) {
  const bdy = document.createElement("main");

  let tasks = filter(project);

  const title = document.createElement("h1");
  title.textContent = project;

  const allTasks = document.createElement("ul");

  tasks.forEach((task) => {
    allTasks.appendChild(createAllTasks(task));
  });

  bdy.appendChild(title);
  bdy.appendChild(allTasks);
  return bdy;
}

function filter(project) {
  let filteredTasks = [];

  if (project === "All") {
    for (const key in tasks) {
      tasks[key].forEach((task) => filteredTasks.push(task));
    }
  } else if (project === "Today") {
    for (const key in tasks) {
      tasks[key].forEach((task) => {
        if (task.dueDate.getDate() === new Date().getDate())
          filteredTasks.push(task);
      });
    }
  } else if (project === "This Week") {
    for (const key in tasks) {
      tasks[key].forEach((task) => {
        if (differenceInWeeks(new Date(), task.dueDate) === 0)
          filteredTasks.push(task);
      });
    }
  } else if (project === "This Month") {
    for (const key in tasks) {
      tasks[key].forEach((task) => {
        if (differenceInCalendarMonths(new Date(), task.dueDate) === 0)
          filteredTasks.push(task);
      });
    }
  } else {
    // if (!tasks[project]) tasks[project] = [];
    // console.log(project);
    tasks[project].forEach((task) => filteredTasks.push(task));
  }

  return filteredTasks;
}

function createAllTasks(task) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let spr = "th";

  if (task.dueDate.getDate() === 1) spr = "st";
  else if (task.dueDate.getDate() === 2) spr = "nd";
  else if (task.dueDate.getDate() === 3) spr = "rd";

  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task-container");

  const front = document.createElement("div");

  const check = document.createElement("input");
  check.type = "checkbox";
  check.checked = task.check;

  const title = document.createElement("span");
  title.textContent = task.title;

  front.appendChild(check);
  front.appendChild(title);

  const dueDate = document.createElement("text");
  dueDate.innerHTML = `${task.dueDate.getDate()}<sup>${spr}</sup> ${
    months[task.dueDate.getMonth()]
  }`;
  dueDate.classList.add("date");

  const back = document.createElement("div");

  back.appendChild(dueDate);
  const img = createImage(Trash, "trash");
  img.addEventListener("click", () => {
    let newTasks = {};
    for (const key in tasks) {
      if (!newTasks[key]) newTasks[key] = [];
      tasks[key].filter((t) => {
        if (t.id !== task.id) newTasks[key].push(t);
      });
    }

    console.log(newTasks);
    console.log(tasks);

    for (const key in tasks) {
      delete tasks[key];
    }

    console.log("A   ", tasks);

    for (const key in newTasks) {
      if (!tasks[key]) tasks[key] = [];
      newTasks[key].forEach((t) => tasks[key].push(t));
    }

    console.log("B   ", tasks);

    localStorage.removeItem("tasks");
    updateSidebar();
    updateBody("All");
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
  back.appendChild(img);

  taskContainer.appendChild(front);
  taskContainer.appendChild(back);

  taskContainer.classList.add(`priority-${task.priority}`);

  if (check.checked) {
    title.classList.toggle("checked");
    dueDate.classList.toggle("checked");
    taskContainer.classList.toggle("gray");
  }

  check.addEventListener("click", () => {
    title.classList.toggle("checked");
    dueDate.classList.toggle("checked");
    taskContainer.classList.toggle("gray");
    task.check = !task.check;

    localStorage.removeItem(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  return taskContainer;
}

function createImage(img, id) {
  const requiredImage = new Image();
  requiredImage.src = img;
  requiredImage.alt = `${id}-icon`;

  requiredImage.id = id;
  requiredImage.classList.add("task-icons");

  return requiredImage;
}
