using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{

    // Using Dependancy Injection to make the context and mapping services available within this controller
    private readonly AuctionDbContext _context;
    private readonly IMapper _mapper;

    public AuctionsController(AuctionDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    //! Get All Auctions Summary
    // Queries the database asynchronously to retrieve all auctions. 
    // Eager loading with .Include(x => x.Item) ensures that the related Item entities are loaded in a single query.
    // Orders the result by the Make property of the associated Item.
    // Converts the result to a list asynchronously
    //Uses AutoMatter to map the list of Auction entities to a list of AuctionDto's
    
    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions()
    {
        var auctions = await _context.Auctions
            .Include(x => x.Item)
            .OrderBy(x => x.Item.Make)
            .ToListAsync();

            return _mapper.Map<List<AuctionDto>>(auctions);
    }


     //! Get Auction by ID Summary
    // Queries the database asynchronously to retrieve a specific auction by its unique identifier.
    // Eager loading with .Include(x => x.Item) ensures that the related Item entity is loaded in a single query.
    // Converts the result to an AuctionDto asynchronously.
    // Returns NotFound if the auction with the specified ID is not found.
    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
    {
        var auction = await _context.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (auction == null) return NotFound();

        return _mapper.Map<AuctionDto>(auction);
    }

     //! Create Auction Summary
    // Maps the provided CreateAuctionDto to an Auction entity using AutoMapper.
    // Assigns the current user as the seller (Replace "test" with actual implementation).
    // Adds the auction to the database context.
    // Saves changes to the database asynchronously.
    // Returns BadRequest if saving changes fails.
    // Returns CreatedAtAction with the ID of the created auction and the mapped AuctionDto.
    // The CreatedAtAction returns a status code of 201 created and also includes a Location Header in the response
    // We can then utilise that location on the front end to perhaps re-direct the user to where the new resource is located.
    [HttpPost]
    public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto auctionDto)
    {
        var auction = _mapper.Map<Auction>(auctionDto);
        //TODO: Add current user as seller
        auction.Seller = "test";

        _context.Auctions.Add(auction);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Could not save changes to the Database");

        return CreatedAtAction(nameof(GetAuctionById), new {auction.Id}, _mapper.Map<AuctionDto>(auction));
    }


    //! Update Auction Summary
    // Retrieves an auction from the database based on the provided ID.
    // If the auction is not found, returns a 404 Not Found response.
    // Checks and updates the auction details using the properties from the UpdateAuctionDto.
    // The null-coalescing operator (??) ensures that if a property in UpdateAuctionDto is not provided,
    // it retains the existing value from the database.
    // Saves changes to the database asynchronously.
    // If successful, returns a 200 OK response; otherwise, returns a 400 Bad Request response.
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto)
    {
        var auction = await _context.Auctions.Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (auction == null) return NotFound();

        //TODO: Check Seller == username

        auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
        auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
        auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
        auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;
        auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;

        var result = await _context.SaveChangesAsync() > 0;

        if (result) return Ok();

        return BadRequest("Could not update Auction");
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAuction(Guid id) 
    {
        var auction = await _context.Auctions.FindAsync(id);

        if (auction == null) return NotFound();

        // TODO: check seller == username

        _context.Auctions.Remove(auction);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Could not Delete Entry from Database");

        return Ok();
    }

}