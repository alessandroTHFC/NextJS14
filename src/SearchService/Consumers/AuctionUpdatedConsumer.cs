using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionUpdatedConsumer : IConsumer<AuctionUpdated>
{
    private readonly IMapper _mapper;

    public AuctionUpdatedConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }

    //! Summary
    // We recieve the message in the form of an Auction Updated Entity
    // That Entity is then mapped to our Search Service Item Entity
    // We then retrieve an Item from our Mongo DB that has the corresponding Id as the one in our AuctionUpdated Entity
    // Then only the fields that are different are then updated.
    // The change is then saved to DB with ExecuteAsync.
    public async Task Consume(ConsumeContext<AuctionUpdated> context)
    {
        Console.WriteLine("=====> Consuming Updated Auction <======" + context.Message.Make);

        var item = _mapper.Map<Item>(context.Message);

        // The item at the end of the modify only statement is  a shorthand way of declaring the type of "new"
        var updatedItem = await DB.Update<Item>()
            .Match(x => x.ID == context.Message.Id)
            .ModifyOnly(x => new
            {
                x.Make,
                x.Model,
                x.Year,
                x.Color,
                x.Mileage,
            }, item)
            .ExecuteAsync();

        if (!updatedItem.IsAcknowledged) throw new MessageException(typeof(AuctionUpdated), "Problem Updating MongoDb");
    }
}
