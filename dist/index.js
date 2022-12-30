var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Modal = /** @class */ (function () {
    function Modal(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.buttonSelector, buttonSelector = _c === void 0 ? '' : _c, _d = _b.type, type = _d === void 0 ? '' : _d, _e = _b.options, options = _e === void 0 ? {
            url: '',
            content: null,
            submitSelector: null,
        } : _e;
        var _this = this;
        this.initOpenModalButtons = function (buttonSelector) {
            if (!buttonSelector)
                console.error('The modal open button is not defined');
            else {
                _this.buttons = document.querySelectorAll(buttonSelector);
                if (!_this.buttons.length)
                    console.error('The modal open button does not exist');
                else {
                    _this.buttons.forEach(function (button) {
                        button.addEventListener('click', _this.openModal);
                    });
                }
            }
        };
        this.openModal = function () {
            $(_this.modal).modal('show');
        };
        this.createDefaultModal = function (content) {
            _this.createModal();
            _this.setContent(content);
        };
        this.createFormModal = function (url, content, submitSelector) {
            _this.createModal();
            if (url) {
                _this.getHtmlForm(url).then(function (html) {
                    _this.setContent(html);
                    if (!submitSelector) {
                        console.error('Submit selector is not defined');
                    }
                    else {
                        var submitButtons = _this.modal.querySelectorAll(submitSelector);
                        if (!submitButtons.length) {
                            console.error('Submit selector does not exisit');
                        }
                        else {
                            submitButtons.forEach(function (button) {
                                button.addEventListener('click', function (e) { return _this.sendRequest(e); });
                            });
                        }
                    }
                });
            }
            else {
                _this.setContent(content);
                if (!submitSelector) {
                    console.error('Submit selector is not defined');
                }
                else {
                    var submitButtons = _this.modal.querySelectorAll(submitSelector);
                    if (!submitButtons.length) {
                        console.error('Submit selector does not exisit');
                    }
                    else {
                        submitButtons.forEach(function (button) {
                            button.addEventListener('click', function (e) { return _this.sendRequest(e); });
                        });
                    }
                }
            }
        };
        this.sendRequest = function (e) {
            var form = e.currentTarget.closest('form');
            var formData = new FormData(form);
            var csrfToken = document.querySelector("input[name='_token']");
            if (!form.getAttribute('action'))
                console.error('Form action is null');
            else {
                $.ajax({
                    method: "POST",
                    url: form.action,
                    data: formData,
                    headers: {
                        'X-CSRF-Token': csrfToken ? csrfToken.value : '',
                    },
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        _this.removeErrors();
                        window.location.reload();
                    },
                    error: function (response) {
                        _this.removeErrors();
                        _this.displayErrors(form, JSON.parse(response.responseText).errors);
                    },
                });
            }
        };
        this.displayErrors = function (form, errors) {
            var inputs = __spreadArray(__spreadArray(__spreadArray([], form.querySelectorAll('input'), true), form.querySelectorAll('select'), true), form.querySelectorAll('textarea'), true);
            inputs.forEach(function (input) {
                if (errors[input.name]) {
                    var errorElement = document.createElement('span');
                    errorElement.classList.add('invalid-feedback', 'd-block', 'w-100');
                    errorElement.innerHTML = errors[input.name];
                    input.parentElement.append(errorElement);
                }
            });
        };
        this.removeErrors = function () {
            _this.modal.querySelectorAll('.invalid-feedback').forEach(function (error) {
                error.remove();
            });
        };
        this.createModal = function () {
            var modalId = Date.now().toString();
            document.body.innerHTML += "\n            <div class=\"modal fade\" id=\"".concat(modalId, "\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n                <div class=\"modal-dialog\" role=\"document\">\n                    <div class=\"modal-content\">\n                        \n                    </div>\n                </div>\n            </div>\n        ");
            _this.modal = document.getElementById(modalId);
        };
        this.setContent = function (content) {
            var modalContent = _this.modal.querySelector('.modal-content');
            switch (typeof (content)) {
                case 'string':
                    modalContent.innerHTML = content;
                    break;
                case 'object':
                    modalContent.innerHTML = '';
                    modalContent.append(content);
                    break;
            }
        };
        this.getHtmlForm = function (url) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(url).then(function (response) {
                            // The API call was successful!
                            return response.text();
                        }).then(function (html) {
                            // This is the HTML from our response as a text string
                            return html;
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        }); };
        this.type = type.toUpperCase();
        switch (this.type) {
            case 'FORM':
                this.createFormModal(options.url, options.content, options.submitSelector);
                break;
            case 'MODAL':
                this.createDefaultModal(options.content);
                break;
            default:
                this.createDefaultModal(options.content);
                break;
        }
        this.initOpenModalButtons(buttonSelector);
    }
    return Modal;
}());
