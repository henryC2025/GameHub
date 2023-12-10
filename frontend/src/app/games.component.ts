import { Component } from "@angular/core";
import { WebService } from "./web.service";
import { SharedService } from "./shared.service";

@Component({
    selector: 'games',
    templateUrl : 'games.component.html',
    styleUrls : ['games.component.css']
})

export class GamesComponent
{
    constructor(public webService : WebService, 
                public sharedService : SharedService) {}

    ngOnInit()
    {
        if(sessionStorage['page'])
        {
            this.page = Number(sessionStorage['page']);
        }
        this.game_list = this.webService.getGames(this.page);
    }

    previousPage()
    {
        if(this.page > 1)
        {
            this.page = this.page - 1;
            sessionStorage['page'] = this.page;
            this.game_list =
                this.webService.getGames(this.page);
        }
    }

    nextPage()
    {
        this.page = this.page + 1;
        sessionStorage['page'] = this.page;
        this.game_list =
            this.webService.getGames(this.page);
    }

    getPlatformClass(platform: string): string 
    {
        const platformClass = this.sharedService.getPlatformClass(platform);
        return platformClass;
    }

    game_list : any = [];
    page : number = 1;   
}