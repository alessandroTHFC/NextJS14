using System.Security.Claims;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using IdentityModel;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;

namespace IdentityService.Services;


//! This Class allows us to customise our tokens sent back to the client
// The IProfileService Interface has two methods, the GetProfileDataAsync
// allows us to customise the tokens. When the client requents a token, during the 
// token issuance process will call this method and then allow us to customise the token.
// in our case we are adding the user's name and username to the token.
public class CustomProfileService : IProfileService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public CustomProfileService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }
    public async Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var user = await _userManager.GetUserAsync(context.Subject);
        var exisitingClaims = await _userManager.GetClaimsAsync(user);
        var username = user.UserName;

        // var claim = new Claim("username", username);

        var claim = new List<Claim>
        {
            new Claim("username", username)
        };

        context.IssuedClaims.AddRange(claim);
        context.IssuedClaims.Add(exisitingClaims.FirstOrDefault(x => x.Type == JwtClaimTypes.Name));
    }

    public Task IsActiveAsync(IsActiveContext context)
    {
        return Task.CompletedTask;
    }
}
