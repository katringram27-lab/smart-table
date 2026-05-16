import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === "sort") {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            action.dataset.value = sortMap[action.dataset.value];
            field = action.dataset.field;
            order = action.dataset.value;

            // @todo: #3.2 — сбросить сортировки остальных колонок
            columns.forEach((column) => {
                //перебираем элементы
                if (column.dataset.field !== action.dataset.field) {
                    // если это не та кнопка, которую нажал пользователь
                    column.dataset.value = "none"; // сбрасываем в начальное состояние
                }
            });
        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
            columns.forEach((column) => {
                // перебираем все кнопки сортировки
                if (column.dataset.value !== "none") {
                    //ищем, которая находится не в начальном состоянии
                    field = column.dataset.field; //сохраняем в переменных поле
                    order = column.dataset.value; //направление сортировки
                }
            });
        }

        const sort = field && order !== "none" ? `${field}:${order}` : null; //сохраним в переменную параметр сортировки в виде field:direction

        return sort ? Object.assign({}, query, { sort }) : query; //если есть сортировка-добавляем, если нет-не трогаем query
    }
}
