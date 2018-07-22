export class View {

    constructor() {
         // this._inputQuantity = document.querySelector('#quantity');
        //this._labelQuantity = document.querySelector('#label-quantity');
        this._inputFile = document.querySelector('#pic');
        this._inputTextHelp = document.querySelector('.help-block');

        this._btnHtml = document.querySelector('.btn-html');
        this._btnScss = document.querySelector('.btn-scss');
        this._btnCss = document.querySelector('.btn-css');

        this._scssCode = document.querySelector('.scss');
        this._htmlCode = document.querySelector('.html');
        this._cssCode = document.querySelector('.css');

        this.btnCopy = document.querySelector('.btn-copy');
        this.btnSubmit = document.querySelector('.submit');

        this._fileUploadContainer = document.querySelector('.form-upload');
    }

    btnCopyChangeLabel(){
        this.btnCopy.innerText = "Copied!";
        setTimeout(() => this.btnCopy.innerText = "Copy", 1000);
    }

    containerActive(e){
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.classList.add("active"); 
    }

    containerRemoveActive(e){
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.classList.remove("active"); 
    }

    hideAllTabs(){
        this._htmlCode.classList.remove("active");
        this._cssCode.classList.remove("active");
        this._scssCode.classList.remove("active");

        this._btnHtml.classList.remove("active");
        this._btnScss.classList.remove("active");
        this._btnCss.classList.remove("active");
    }

    updateLabelText(value){
        this._inputTextHelp.innerText = value;
    }

    addTextIntoScssTab(data){
        let css = `        
        /*CSS CODE*/

        ${data}

        /*END CSS CODE*/
        `;

        let html = `
        <!-- HTML CODE -->

            <div class="holder">
                <div class="image-css"></div>
            </div>

        <!-- END HTML CODE -->
        `;
        document.querySelector('.css-text code').innerText = css;
        document.querySelector('.html-text code').innerText = html;
    }

    addSassCode(data){
        document.querySelector('.sass-text code').innerText = JSON.parse(data);
    }

    showHtml(event){
        event.preventDefault();
        this.hideAllTabs();  
        this._htmlCode.classList.add("active");   
        this._btnHtml.classList.add("active");                 
    }


    showScss(event) {
        event.preventDefault();
        this.hideAllTabs();  
        this._scssCode.classList.add("active");     
        this._btnScss.classList.add("active");                  
    }

    showCss(event){
        event.preventDefault();
        this.hideAllTabs();  
        this._cssCode.classList.add("active");     
        this._btnCss.classList.add("active");                  
    }

}