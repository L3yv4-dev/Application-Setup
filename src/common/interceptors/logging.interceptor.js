"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RequestIdInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestIdInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const async_hooks_1 = require("async_hooks");
const uuid_1 = require("uuid");
let RequestIdInterceptor = RequestIdInterceptor_1 = class RequestIdInterceptor {
    constructor() {
        this.logger = new common_1.Logger(RequestIdInterceptor_1.name);
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const requestId = (0, uuid_1.v4)();
        const requestContext = {
            requestId,
            path: request.path,
            method: request.method,
        };
        // Agregar requestId a headers de request y response
        request.headers['x-request-id'] = requestId;
        response.setHeader('x-request-id', requestId);
        return RequestIdInterceptor_1.als.run(requestContext, () => {
            this.logRequestStart(requestContext);
            return next.handle().pipe((0, operators_1.tap)(() => this.logRequestCompletion(requestContext)), (0, operators_1.catchError)((err) => {
                const error = err instanceof Error ? err : new Error(String(err));
                this.logRequestError(error, requestContext);
                return (0, rxjs_1.throwError)(() => this.prepareError(error));
            }));
        });
    }
    logRequestStart(context) {
        this.logger.log(Object.assign({ message: 'Request started' }, context));
    }
    logRequestCompletion(context) {
        this.logger.log(Object.assign({ message: 'Request completed' }, context));
    }
    logRequestError(error, context) {
        this.logger.error(Object.assign({ message: 'Request failed', error: error.message, stack: error.stack }, context));
    }
    prepareError(error) {
        // Puedes personalizar el error aquí si quieres
        return error;
    }
    static getContext() {
        return this.als.getStore();
    }
};
exports.RequestIdInterceptor = RequestIdInterceptor;
RequestIdInterceptor.als = new async_hooks_1.AsyncLocalStorage();
exports.RequestIdInterceptor = RequestIdInterceptor = RequestIdInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], RequestIdInterceptor);
