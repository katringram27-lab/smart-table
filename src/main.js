import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
// @todo: подключение
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные используемые в render()
//вызов initData присваиваем const API
const API = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage); // привели кол-во стр. к числу
    const page = parseInt(state.page ?? 1); //номер стр. по умолчанию 1 и то же число

    return {
        ...state,
        rowsPerPage,
        page,
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
//делаем функцию render асинхронной
async function render(action) {
    let state = collectState(); // состояние полей из таблицы
    // заменяем let result на let query
    let query = {}; // копируем для последующего изменения, здесь будут формироваться параметры запроса

    // @todo: использование

    query = applySearching(query, state, action); //result на query

    query = applyFiltering(query, state, action); //result на query

    query = applySorting(query, state, action);

    query = applyPagination(query, state, action); //обновляем query

    //добавляем получение данных

    const { total, items } = await API.getRecords(query);

    updatePagination(total, query); //перерисовываем пагинатор
    sampleTable.render(items);
}

const sampleTable = initTable(
    {
        tableTemplate: "table",
        rowTemplate: "row",
        before: ["search", "header", "filter"],
        after: ["pagination"],
    },
    render
);

const applySearching = initSearching("search");

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);

const applySorting = initSorting([sampleTable.header.elements.sortByDate, sampleTable.header.elements.sortByTotal]);

// @todo: инициализация
const { applyPagination, updatePagination } = initPagination(
    sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
    (el, page, isCurrent) => {
        // и колбэк, чтобы заполнять кнопки страниц данными
        const input = el.querySelector("input");
        const label = el.querySelector("span");
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

//объявляем асинхронную функцию init()
async function init() {
    const indexes = await API.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}

init().then(render);

