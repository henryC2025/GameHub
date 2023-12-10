import { Injectable } from "@angular/core";

@Injectable()
export class SharedService
{
    getPlatformClass(platform: string): string 
    {
        const lowerPlatform = platform.toLowerCase();

        if (lowerPlatform.startsWith('playstation')) 
        {
            return 'platform-ps4';
        } 
        else if (lowerPlatform.startsWith('xbox')) 
        {
            return 'platform-xbox';
        } 
        else if (lowerPlatform === 'pc') 
        {
            return 'platform-pc';
        } 
        else if (lowerPlatform === 'switch') 
        {
            return 'platform-switch';
        }
        else if (lowerPlatform === 'dreamcast') 
        {
            return 'platform-dreamcast';
        } 
        else if (lowerPlatform.endsWith('64')) 
        {
            return 'platform-64';
        } 
        else if (lowerPlatform === 'gamecube') 
        {
            return 'platform-gamecube';
        }
        else if (lowerPlatform.startsWith('wii')) 
        {
            return 'platform-wii';
        }
        else if (lowerPlatform.startsWith('game boy')) 
        {
            return 'platform-gameboy';
        }
        else if (lowerPlatform === '3ds') 
        {
            return 'platform-3ds';
        }
        else if (lowerPlatform === 'ds') 
        {
            return 'platform-ds';
        }
        else 
        {
            return ''; // Default class or empty string
        }
    }
}