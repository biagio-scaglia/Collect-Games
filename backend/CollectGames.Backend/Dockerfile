# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["CollectGames.Backend.csproj", "./"]
RUN dotnet restore "CollectGames.Backend.csproj"

# Copy everything and build
COPY . .
RUN dotnet build "CollectGames.Backend.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "CollectGames.Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 5000
EXPOSE 5001

# Copy published files
COPY --from=publish /app/publish .

# Create directory for images if it doesn't exist
RUN mkdir -p /app/wwwroot/images

# Command to run the app
ENTRYPOINT ["dotnet", "CollectGames.Backend.dll"]
