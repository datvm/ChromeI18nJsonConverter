class ConvertApp extends HTMLElement {

    txtChrJson: HTMLTextAreaElement = this.querySelector("#txt-chrome")!;
    txtKValueJson: HTMLTextAreaElement = this.querySelector("#txt-key-value")!;

    constructor() {
        super();

        this.querySelector(".btn-to-i18n")?.addEventListener("click",
            () => this.convertToChr());
        this.querySelector(".btn-to-key-value")?.addEventListener("click",
            () => this.convertToKValue());

        this.querySelectorAll<HTMLTextAreaElement>("textarea[id]").forEach(txt => {
            const v = localStorage.getItem(txt.id);
            if (v) {
                txt.value = v;
            }
        });
    }

    private convert(txtIn: HTMLTextAreaElement, txtOut: HTMLTextAreaElement,
        transform: (json: any) => any) {
        const input = txtIn.value;
        if (input.length < 10000) {
            localStorage.setItem(txtIn.id, input);
        }

        let json;
        try {
            json = JSON.parse(input);
        } catch (e) {
            alert("Invalid input JSON: " + e);
            return;
        }

        transform(json);
        
        const outJson =JSON.stringify(json, undefined, 4) 
        txtOut.value = outJson;
        if (outJson.length < 10000) {
            localStorage.setItem(txtOut.id, outJson);
        }
    }

    convertToChr() {
        this.convert(this.txtKValueJson, this.txtChrJson,
            json => {
                for (const k in json) {
                    json[k] = {
                        message: json[k],
                    }
                }
            });
    }

    convertToKValue() {
        this.convert(this.txtChrJson, this.txtKValueJson,
            json => {
                for (const k in json) {
                    json[k] = json[k].message ?? "";
                }
            });
    }

    static register() {
        customElements.define("convert-app", this);
    }

}
ConvertApp.register();