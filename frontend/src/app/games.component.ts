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
    search_query: string = '';
    search_results: any = [];
    game_list : any = [];
    page : number = 1;
    total_pages : number = 1;

    constructor(public webService : WebService, 
                public sharedService : SharedService) {}

    search()
    {   
        if(this.search_query)
        {
            this.webService.searchGame(this.search_query).subscribe(
                (data) => 
                {
                    this.search_results = data;
                },
                (error) => 
                {
                    console.error('Error:', error);
                }
            );
        }
        else
        {
            console.log("Something went wrong!")
        }
    }

    ngOnInit()
    {
        if(sessionStorage['page'])
        {
            this.page = Number(sessionStorage['page']);
        }
        this.game_list = this.webService.getGames(this.page);

        this.webService.getCountOfGames().subscribe((data: any) => {
            const count_of_games = parseInt(data);
            this.total_pages = Math.ceil(count_of_games / 12);
            console.log(this.total_pages)
        });
    }

    firstPage()
    {
        if (this.page > 1)
        {
            this.page = 1;
            sessionStorage['page'] = this.page;
            this.game_list = this.webService.getGames(this.page);
        }
    }

    lastPage()
    {
        if (this.page < this.total_pages)
        {
            this.page = this.total_pages;
            sessionStorage['page'] = this.page;
            this.game_list = this.webService.getGames(this.page);
        }
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

    goToPage(pageNum: number) 
    {
        this.page = pageNum;
        sessionStorage['page'] = this.page;
        this.game_list =
            this.webService.getGames(this.page);
    }

    getPlatformClass(platform: string): string 
    {
        const platformClass = this.sharedService.getPlatformClass(platform);
        return platformClass;
    }
}