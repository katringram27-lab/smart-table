import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before = [], after = []} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы

    if (before) {
        const beforeElement = cloneTemplate(before).container;
        root.container.parentNode.insertBefore(beforeElement, root.container);
    }
    if (after) {
        const afterElement = cloneTemplate(after).container;
        root.container.parentNode.insertAfter(afterElement, root.container);
    }
    //объект для хранения клонированных шаблонов для посл доступа
    //root.additionalTemplates = {
        //before: [],
        //after: []
    //};
    //обработка шаблонов "до" таблицы в обратном порядке
    if (before.length > 0) {
        //клонируем шаблоны о сохраняем в массиве
        const beforeClones = before.map(templateId => cloneTemplate(templateId));
        //сохраняем клонир шаблоны в объекте root
        root.additionalTemplates.before = beforeClones;
        //добавляем в DOM в обратном порядке, самый новый-первый
        beforeClones.reverse().forEach(clone => {
            root.container.prepend(clone.container);
        });
    }

    //обработка шаблонов "после" таблицы
    if (after.length > 0) {
        //клонируем шаблоны и сохраняем в массиве
        const afterClones = after.map(templateId => cloneTemplate(templateId));
        //сохраняем клонир шаблоны в объекте root
        root.additionalTemplates.after = afterClones;
        //добавляем в DOM в прямом порядке
        afterClones.forEach(clone => {
            root.container.appendChild(clone.container);
        });
    }

    // @todo: #1.3 —  обработать события и вызвать onAction()
    //добавление обработчиков событий к  root.container
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(() => {
            onAction();
        }, 0);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });
    

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => { 
        const row = cloneTemplate(rowTemplate);
        Object.keys(item).forEach(key => {
            if (row.elements && row.elements[key] !== undefined) {
            row.elements[key].textContent = item[key];
        }
        });
        return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    };

    return {...root, render};
}