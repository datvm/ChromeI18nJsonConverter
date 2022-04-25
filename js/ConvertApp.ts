class ConvertApp extends HTMLElement {

    txtChrJson: HTMLInputElement = this.querySelector(".txt-chrome")!;
    txtKValueJson: HTMLInputElement = this.querySelector(".txt-key-value")!;

    constructor() {
        super();

        this.querySelector(".btn-to-i18n")?.addEventListener("click",
            () => this.convertToChr());
        this.querySelector(".btn-to-key-value")?.addEventListener("click",
            () => this.convertToKValue());
    }

    convertToChr() {
        const input = this.txtKValueJson.value;
        let json;
        try {
            json = JSON.parse(input);
        } catch(e) {
            alert("Invalid input JSON: " + e);
            return;
        }

        const out: any = {};
        for (const k in json) {
            out[k] = {
                message: json[k],
            }
        }

        this.txtChrJson.value = JSON.stringify(out, undefined, 4);
    }

    convertToKValue() {
        const input = this.txtChrJson.value;
        let json;
        try {
            json = JSON.parse(input);
        } catch(e) {
            alert("Invalid input JSON: " + e);
            return;
        }

        const out: any = {};
        for (const k in json) {
            out[k] = json[k].message ?? "";
        }

        this.txtKValueJson.value = JSON.stringify(out, undefined, 4);
    }

    static register() {
        customElements.define("convert-app", this);
    }

}
ConvertApp.register();