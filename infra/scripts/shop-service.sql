SELECT s0."Id"::text AS "Id", s0."Name", s0."IsActive", s0."Type", COALESCE(s0."UpdatedAt"::text, '') AS "UpdatedAt"
FROM "ShopUser" AS s
INNER JOIN "Shop" AS s0 ON s."ShopId" = s0."Id"
WHERE s."UserId" = '5549c55e-a7f7-4c30-935a-22eeeef2264f' 
ORDER BY s0."Name" DESC
limit 10 OFFSET 0;

select count(*) from "Shop" s ;


SELECT s0."Id"::text AS "Id", s0."Name", s0."IsActive", s0."Type", COALESCE(s0."UpdatedAt"::text, '') AS "UpdatedAt"
FROM "ShopUser" AS s
INNER JOIN "Shop" AS s0 ON s."ShopId" = s0."Id"
WHERE s."UserId" = '5549c55e-a7f7-4c30-935a-22eeeef2264f'::uuid AND s0."Type" = ANY ('{1}') AND lower(s0."Name") LIKE 'my%'
ORDER BY s0."Name" DESC
LIMIT 10 OFFSET 0;

SELECT s0."Id"::text AS "Id", s0."Name", s0."IsActive", s0."Type", COALESCE(s0."UpdatedAt"::text, '') AS "UpdatedAt"
FROM "ShopUser" AS s
INNER JOIN "Shop" AS s0 ON s."ShopId" = s0."Id"
WHERE s."UserId" = '5549c55e-a7f7-4c30-935a-22eeeef2264f'::uuid AND s0."Type" = ANY ('{1}') AND lower(s0."Name") LIKE 'my%'
ORDER BY s0."Name" DESC
LIMIT 10 OFFSET 0

SELECT s0."Id"::text AS "Id", s0."Name", s0."IsActive", s0."Type", COALESCE(s0."UpdatedAt"::text, '') AS "UpdatedAt"
FROM "ShopUser" AS s
INNER JOIN "Shop" AS s0 ON s."ShopId" = s0."Id"
WHERE s."UserId" = '5549c55e-a7f7-4c30-935a-22eeeef2264f'::uuid AND s0."Type" = ANY ('{1}') AND to_tsvector('english', s0."Name") @@ phraseto_tsquery('english', '4282')
ORDER BY COALESCE(s0."UpdatedAt"::text, ''), s0."Id"::text
limit 10 OFFSET 0

SELECT s0."Id"::text AS "Id", s0."Name", s0."IsActive", s0."Type", COALESCE(s0."UpdatedAt"::text, '') AS "UpdatedAt"
FROM "ShopUser" AS s
INNER JOIN "Shop" AS s0 ON s."ShopId" = s0."Id"
WHERE s."UserId" = '5549c55e-a7f7-4c30-935a-22eeeef2264f'::uuid AND s0."Type" = ANY ('{1}') AND to_tsvector('english', s0."Name") @@ phraseto_tsquery('english', 'name')
ORDER BY COALESCE(s0."UpdatedAt"::text, ''), s0."Id"::text
limit 10 OFFSET 0


-- 1. Use a CTE to generate the initial 1,000,000 data points.
WITH RECURSIVE data_to_insert AS (
    SELECT
        1 AS i,
        gen_random_uuid() AS shop_id
    UNION ALL
    SELECT
        i + 1,
        gen_random_uuid()
    FROM data_to_insert
    WHERE i < 1000000
),
-- 2. Insert into Shop and use RETURNING to capture the IDs of the new rows.
inserted_shops AS (
    INSERT INTO "Shop" ("Id", "Name", "Type", "IsActive", "AuthClientCreationStatus", "ConfigurationCreationStatus", "DnsCreationStatus", "SubscriptionStatus", "CreatedAt", "UpdatedAt", "LastActivedAt", "ActivatedAt")
    SELECT
        shop_id,
        'My name ' || (i - 1),
        1,
        true,
        0, 
        0,
        0,
        0,
        now(),
        null,
        null,
        null
    FROM
        data_to_insert
    RETURNING "Id" -- <--- CRITICAL: Returns the ID of every inserted Shop
)
-- 3. Insert the corresponding ShopUser data using the IDs captured above.
INSERT INTO "ShopUser" ("Id", "ShopId", "ShopUserType", "UserId", "CreatedAt", "UpdatedAt")
SELECT
    gen_random_uuid() AS shop_user_id,
    s."Id" AS shop_id,
    0,
    '5549c55e-a7f7-4c30-935a-22eeeef2264f'::uuid AS user_id_guid,
    now(),
    null
FROM
    inserted_shops s; -- <--- Selects ONLY the newly inserted IDs