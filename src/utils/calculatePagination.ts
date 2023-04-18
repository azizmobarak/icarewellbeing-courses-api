export type Pagination = {
    skip: number
    limit: number
    currentPage: number
    totalPages: number
    nenxtPage: number
}

export function getPaginationByPageNumber(
    totalItems: number,
    limit: number,
    totalPages: number,
    page?: number
): Pagination {
    if (!page) {
        return {
            skip: 0,
            limit,
            currentPage: 0,
            totalPages: totalPages,
            nenxtPage: 0,
        }
    }

    const skip = (page - 1) * totalItems

    return {
        skip,
        limit,
        currentPage: page,
        totalPages: totalItems / limit,
        nenxtPage: getNextPage(totalItems, limit, page),
    }
}

const getNextPage = (
    totalItems: number,
    limit: number,
    currentPage: number
): number => {
    const isNext = currentPage > totalItems / limit
    if (isNext) {
        return currentPage
    } else {
        return currentPage + 1
    }
}
