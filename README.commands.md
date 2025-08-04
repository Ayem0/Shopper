## Generate a backend service

```sh
nx g @nx-dotnet/core:application name-service --language "C#" --directory services --pathScheme nx --skipSwaggerLib true --solutionFile shopify-clone.nx-dotnet.sln
```

## Generate a backend library

```sh
nx g @nx-dotnet/core:library library-name --language "C#" --directory cs --pathScheme nx --skipSwaggerLib true --solutionFile shopify-clone.nx-dotnet.sln
```

## Generate proto libraries

#### Move inside the proto folder then

```sh
npx buf generate
```
