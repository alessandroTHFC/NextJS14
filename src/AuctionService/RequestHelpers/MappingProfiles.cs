using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;

namespace AuctionService.RequestHelpers;

public class MappingProfiles : Profile
{  
    public MappingProfiles()
    {   
        // This line defines a mapping from the Auction class to the AuctionDto class.
        // The IncludeMembers method includes properties from the Item property of Auction when mapping to AuctionDto.
        // It means that properties of AuctionDto will include properties from Item.
        CreateMap<Auction, AuctionDto>().IncludeMembers(x => x.Item);

        // This line defines a mapping from the Item class to the AuctionDto class.
        // It doesn't include any additional members.
        CreateMap<Item, AuctionDto>();

        // This line defines a mapping from CreateAuctionDto to Auction.
        // The ForMember method allows you to customize the mapping for a specific property (Item in this case).
        // d => d.Item specifies the destination property (Item property in Auction).
        // o.MapFrom(s => s) specifies that the source property (Item property in CreateAuctionDto) should be mapped to the destination property.
        CreateMap<CreateAuctionDto, Auction>()
            .ForMember(d => d.Item, o => o.MapFrom(s => s));

        // This line defines a mapping from CreateAuctionDto to Item.
        // This mapping is separate from the one defined for Auction.    
        CreateMap<CreateAuctionDto, Item>();
    }

    //! Further explanation of ForMember statement
    /*
        d: Represents the destination property.
        - In this case, it's d.Item, which means the property named Item in the destination object (d).

        o: Represents the options or configuration for the mapping.
        - It allows you to provide additional instructions or configurations for how the mapping should be performed.

        s: Represents the source property. 
        - It's the property named Item in the source object (s).

        So, in the context of AutoMapper:
        - "For the destination property (d.Item), use the options (o) to map it from the source property (s.Item)."
    */

}
