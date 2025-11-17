using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShopifyClone.Cs.Shared.src.Core.Models;

namespace Data;

public class OutboxMessageConfiguration : IEntityTypeConfiguration<OutboxMessage>
{
    public void Configure(EntityTypeBuilder<OutboxMessage> builder)
    {
        builder.Property(e => e.Timestamp)
            .HasColumnType("timestamptz") // PostgreSQL timestamp with timezone
            .IsRequired();
    }
}
