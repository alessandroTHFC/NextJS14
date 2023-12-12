using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionCreatedConsumer : IConsumer<AuctionCreated>
{
    private readonly IMapper _mapper;

    public AuctionCreatedConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }

    // Below is a "Consumer" this piece of code is where our messages recieved by the Search Service are Handled. 
    // In this case we are getting the message recieved by our SearchService in the ConsumeContext which will be in the form of AuctionCreated
    // AuctionCreated is outlined in our Contracts. 
    // We are then mapping the value in this AuctionCreated object which is in the message to an Item Class Object which is what we store in our MongoDB
    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        Console.WriteLine("========> Consuming Auction Created: " + context.Message.Id);

        var item = _mapper.Map<Item>(context.Message);

        if (item.Model == "Foo") throw new ArgumentException("Cant sell Foo Cars mang");

        await item.SaveAsync();
    }
}
