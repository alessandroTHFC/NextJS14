using System.Text.Json;
using MongoDB.Driver;
using MongoDB.Entities;
using SearchService.Models;
using SearchService.Services;

namespace SearchService;

public class DbInitializer
{
    public static async Task InitDb(WebApplication app)
    {
        // Initialize the MongoDB database connection and settings.
        await DB.InitAsync("SearchDb", MongoClientSettings.
            FromConnectionString(app.Configuration.GetConnectionString("MongoDbConnection")));

        // This method initializes an index creation operation for the "Item" class.
        // An index provides a quick lookup mechanism to locate specific rows in a table based on the values in one or more columns.
        // In summary, the user's action triggers a search query. The backend uses the index to efficiently locate the relevant data in the database and returns it to the frontend
        // This displays the results to the user. This process helps optimize the speed and efficiency of searches.
        await DB.Index<Item>()
            .Key(x => x.Make, KeyType.Text)
            .Key(x => x.Model, KeyType.Text)
            .Key(x => x.Color, KeyType.Text)
            .CreateAsync();

        var count = await DB.CountAsync<Item>();

        // Below code is the new way of getting data into the database.
        // Here we use HttpClient and comunicate with the AuctionService to retrieve the Items from there. 
        using var scope = app.Services.CreateScope();

        var httpClient = scope.ServiceProvider.GetRequiredService<AuctionServiceHttpClient>();

        var items = await httpClient.GetItemsForSearchDb();

        Console.WriteLine(items.Count + "returned from the auction service");

        if (items.Count > 0) await DB.SaveAsync(items);



        //! Old way of getting data into database
        //* This way is retrieving data from a file 
        // if (count == 0)
        // {
        //     Console.WriteLine("No Data - Will Attempt To Seed");
        //     var itemData = await File.ReadAllTextAsync("Data/auctions.json");

        //     var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

        //     var items = JsonSerializer.Deserialize<List<Item>>(itemData, options);

        //     await DB.SaveAsync(items);

        //}
    }
}
