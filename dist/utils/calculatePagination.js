"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationByPageNumber = void 0;
function getPaginationByPageNumber(totalItems, limit, totalPages, page) {
    if (!page) {
        return {
            skip: 0,
            limit: limit,
            currentPage: 0,
            totalPages: totalPages,
            nenxtPage: 0,
        };
    }
    var skip = (page - 1) * totalItems;
    return {
        skip: skip,
        limit: limit,
        currentPage: page,
        totalPages: totalItems / limit,
        nenxtPage: getNextPage(totalItems, limit, page),
    };
}
exports.getPaginationByPageNumber = getPaginationByPageNumber;
var getNextPage = function (totalItems, limit, currentPage) {
    var isNext = currentPage > (totalItems / limit);
    if (isNext) {
        return currentPage;
    }
    else {
        return currentPage + 1;
    }
};
