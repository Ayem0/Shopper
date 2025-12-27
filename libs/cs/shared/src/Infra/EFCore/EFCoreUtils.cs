using System.Linq.Expressions;

namespace ShopifyClone.Cs.Shared.src.Infra.EFCore;

public static class EFCoreUtils
{
    public static IQueryable<T> ApplyQueryPagination<T>(IQueryable<T> baseQuery, int pageIndex, int pageSize)
    {
        return baseQuery.Skip(pageIndex * pageSize).Take(pageSize);
    }

    public static (int maxPageIndex, int pageIndex) CalculateMaxPageIndex(int totalResults, int pageSize, int reqPageIndex)
    {
        var maxPageIndex = totalResults > 0
            ? (int)Math.Ceiling((double)totalResults / pageSize) - 1
            : 0;
        var pageIndex = reqPageIndex > maxPageIndex ? 0 : reqPageIndex;
        return (maxPageIndex, pageIndex);
    }


    public static IOrderedQueryable<T> ApplyQuerySorting<T>(
        IQueryable<T> baseQuery,
        bool desc,
        Expression<Func<T, object?>> primarySelector,
        Expression<Func<T, object?>> secondarySelector
    ) => desc
        ? baseQuery.OrderByDescending(primarySelector).ThenBy(secondarySelector)
        : baseQuery.OrderBy(primarySelector).ThenBy(secondarySelector);

    public static IQueryable<T> ApplyQueryFilters<T>(IQueryable<T> baseQuery, params Expression<Func<T, bool>>?[] filters)
    {
        var query = baseQuery;
        foreach (var filter in filters)
        {
            if (filter != null)
                query = query.Where(filter);
        }
        return query;
    }

    private static int ValidatePageSize(int reqPageSize)
    {
        if (reqPageSize != 10 && reqPageSize != 25 && reqPageSize != 50) return 10;
        return reqPageSize;
    }

    public async static Task<(T[] items, int totalResults, int maxPageIndex, int pageIndex, int pageSize)> TableQuery<T>(this IQueryable<T> query, TableQueryParams<T> p, IEFCoreQueryAdapter ef)
    {
        var pageSize = ValidatePageSize(p.ReqPageSize);
        var filteredQuery = ApplyQueryFilters(query, p.Filters);
        var totalResults = await ef.CountAsync(filteredQuery);
        var (maxPageIndex, pageIndex) = CalculateMaxPageIndex(totalResults, pageSize, p.ReqPageIndex);
        var sortedQuery = ApplyQuerySorting(filteredQuery, p.Desc, p.PrimarySortingSelector, p.SecondarySortingSelector);
        var paginatedQuery = ApplyQueryPagination(sortedQuery, pageIndex, pageSize);
        var items = await ef.ToArrayAsync(paginatedQuery);
        return (items, totalResults, maxPageIndex, pageIndex, pageSize);
    }

    public class TableQueryParams<T>
    {
        public required bool Desc { get; set; }
        public required Expression<Func<T, object?>> PrimarySortingSelector { get; set; }
        public required Expression<Func<T, object?>> SecondarySortingSelector { get; set; }
        public int ReqPageSize { get; set; }
        public int ReqPageIndex { get; set; }
        public required Expression<Func<T, bool>>?[] Filters { get; set; }
    }
}
