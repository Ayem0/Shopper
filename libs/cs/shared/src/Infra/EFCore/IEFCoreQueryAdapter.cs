using System;

namespace ShopifyClone.Cs.Shared.src.Infra.EFCore;

public interface IEFCoreQueryAdapter
{
    Task<T[]> ToArrayAsync<T>(IQueryable<T> query, CancellationToken ct = default);
    Task<int> CountAsync<T>(IQueryable<T> query, CancellationToken ct = default);
}
