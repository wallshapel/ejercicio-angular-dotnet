# ---------- Build ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Explicit copy of csproj (in its actual subfolder within the context)
# Context = ./api-angular-backend → csproj is in ./api-angular-backend/api-angular-backend.csproj
COPY api-angular-backend/api-angular-backend.csproj ./api-angular-backend/

# Restore with the exact path
RUN dotnet restore ./api-angular-backend/api-angular-backend.csproj

# Copy the rest of the code and publish
COPY . .
RUN dotnet publish ./api-angular-backend/api-angular-backend.csproj -c Release -o /app/publish /p:UseAppHost=false

# ---------- Runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "api-angular-backend.dll"]
