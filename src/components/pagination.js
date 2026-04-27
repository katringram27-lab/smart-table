import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    return (data, state, action) => {
        // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
        const rowsPerPage = state.rowsPerPage;                        // будем часто обращаться, чтобы короче записывать
        const pageCount = Math.ceil(data.length / rowsPerPage);        // число страниц округляем в большую сторону
        let page = state.page;

        if (action) switch(action.name) {
    case 'prev': page = Math.max(1, page - 1); break;            // переход на предыдущую страницу
    case 'next': page = Math.min(pageCount, page + 1); break;    // переход на следующую страницу
    case 'first': page = 1; break;                                // переход на первую страницу
    case 'last': page = pageCount; break;                        // переход на последнюю страницу
}
    //}
        //}                                        // страница переменной, потому что она может меняться при обработке действий позже

        // @todo: #2.6 — обработать действия



        // @todo: #2.4 — получить список видимых страниц и вывести их

        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));

        // @todo: #2.5 — обновить статус пагинации

        fromRow.textContent = (page - 1) * rowsPerPage + 1;
        toRow.textContent = Math.min((page * rowsPerPage), data.length);
        totalRows.textContent = data.length;

        // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
        const skip = (page - 1) * rowsPerPage;            // сколько строк нужно пропустить
        return data.slice(skip, skip + rowsPerPage);
        //return data.slice(0, 10);    // получаем нужную часть строк (заменяем имеющийся return)
    }
}