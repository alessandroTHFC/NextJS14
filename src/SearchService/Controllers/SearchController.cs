using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService.Models;
using SearchService.RequestHelpers;
using ZstdSharp.Unsafe;

namespace SearchService.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{   
    //! Search Items Summary
    // This endpoint performs a paginated search for items based on various parameters provided in the query string.
    // It supports filtering, sorting, and pagination, allowing clients to find specific items.
    // Have to pass attribute [FromQuery] as paramater.
    // If SearchParams searchParams was passing in without this attribute, it would expect to find this information in the body of request.
    // Instead we are recieving this information via the query string in the browser.
    [HttpGet]
    public async Task<ActionResult<List<Item>>> SearchItems([FromQuery] SearchParams searchParams)
    {
        // Initialize the paged search query for the 'Item' collection in MongoDB.
        var query = DB.PagedSearch<Item, Item>();

        // Check if a search term is provided, and if so, perform a full-text search and sort by text score.
        if (!string.IsNullOrEmpty(searchParams.SearchTerm))
        {
            query.Match(Search.Full,searchParams.SearchTerm).SortByTextScore();
        }

        // Dynamically apply sorting based on the 'OrderBy' parameter in the query string.
        query = searchParams.OrderBy switch
        {
            "make" => query.Sort(x => x.Ascending(a => a.Make)).Sort(x => x.Ascending(a => a.Model)), // Sort by Make property in ascending order.
            "new" => query.Sort(x => x.Descending(a => a.CreatedAt)), // Sort by creation date in descending order.
            _ => query.Sort(x => x.Ascending(a => a.AuctionEnd)) // Default: Sort by AuctionEnd property in ascending order.
        };
        
        // Dynamically apply filtering based on the 'FilterBy' parameter in the query string.
        query = searchParams.FilterBy switch
        {
            "finished" => query.Match(x => x.AuctionEnd < DateTime.UtcNow),
            "endingSoon" => query.Match(x => x.AuctionEnd < DateTime.UtcNow.AddHours(6) && x.AuctionEnd > DateTime.UtcNow),
            _ => query.Match(x => x.AuctionEnd > DateTime.UtcNow)
        };

        // If the 'Seller' parameter is provided, filter the items by the specified seller.
        if (!string.IsNullOrEmpty(searchParams.Seller))
        {
            query.Match(x => x.Seller == searchParams.Seller);
        }

        // If the 'Winner' parameter is provided, filter the items by the specified winner.
        if (!string.IsNullOrEmpty(searchParams.Winner))
        {
            query.Match(x => x.Winner == searchParams.Winner);
        }

        // Apply pagination settings based on the 'PageNumber' and 'PageSize' parameters.
        query.PageNumber(searchParams.PageNumber);
        query.PageSize(searchParams.PageSize);

        // Execute the paged search query asynchronously.
        var result = await query.ExecuteAsync();

        // Return a response containing the paginated results(object), page count, and total count.
        return Ok(new {
            results = result.Results,
            pageCount = result.PageCount,
            totalCount = result.TotalCount
        });
    }
}
