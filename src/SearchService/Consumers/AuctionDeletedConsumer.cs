using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionDeletedConsumer : IConsumer<AuctionDeleted>
{
    public async Task Consume(ConsumeContext<AuctionDeleted> context)
    {
        Console.WriteLine("======> Consuming Auction Deleted: " + context.Message.Id);

        var deletedItem = await DB.DeleteAsync<Item>(context.Message.Id);

        if (!deletedItem.IsAcknowledged) throw new MessageException(typeof(AuctionDeleted), "Problem deleting Item in MongoDb");
    }
}
