// Type definitions for miq v1.11.0
// Project: https://bitstorm.org/javascript/miq/
// Definitions by: Edwin Martin <https://bitstorm.org>
// Definitions:

interface IMiqAjaxConfig {
    method?: string;
    data?: any;
    dataType?: string;
    headers?: any;
}

interface IMiqStatic {
    (callback: () => any): void;
    (element: Element): IMiq;
    (elementArray: Element[]): IMiq;
    (object: IMiq): IMiq;
    (html: string, ownerDocument?: Document): IMiq;
    (): DocumentFragment;
    ajax(url: string, options?: IMiqAjaxConfig): Promise;
    ajaxCallback(url: string, resolve: (data: any) => any, reject: (error: string) => any, options?: IMiqAjaxConfig): void;
    miq: string;
}

/**
 * Miq is a lightweight jQuery-like DOM library.
 * See https://bitstorm.org/javascript/miq/
 */
interface IMiq extends Array {
    first: Element;

    [index: number]: Element;

    prop(propName: string): string;
    prop(propName: string, value: string|number): IMiq;

    attr(attributeName: string): string;
    attr(attributeName: string, value: string|number): IMiq;
    removeAttr(attributeName: string): IMiq;

    addClass(className: string): IMiq;
    removeClass(className: string): IMiq;
    hasClass(className: string): boolean;

    html(): string;
    html(html: string|number): IMiq;

    text(): string;
    text(text: string|number): IMiq;


    append(el: Element): IMiq;
    append(el: IMiq): IMiq;

    before(el: Element): IMiq;
    before(el: IMiq): IMiq;

    clone(): IMiq;

    closest(selector: string): IMiq|null;

    css(property: string): string;
    css(property: string, value: string|number): IMiq;

    eq(index: number): IMiq;

    find(selector: string): IMiq|null;

    is(selector: string): IMiq;

    parent(selector: string): IMiq;

    remove(): IMiq;

    val(): string;
    val(value: string|number): IMiq;

    on(event: string, handler: (event?: Event) => any);
    off(event: string, handler: () => any);

    length: number;
}

declare var miq: IMiqStatic;
declare var $: IMiqStatic;
