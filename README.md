# Quest for the Frozen Flame Tools (Unofficial)

Tools for running book 3 of Quest for the Frozen Flame

Uses the [Open Gaming License](./OpenGameLicense.md) and [CUP](https://paizo.com/community/communityuse)

> This FoundryVTT module uses trademarks and/or copyrights owned by Paizo Inc., used under Paizo's Community Use Policy (paizo.com/communityuse). We are expressly prohibited from charging you to use or access this content. This FoundryVTT module is not published, endorsed, or specifically approved by Paizo. For more information about Paizo Inc. and Paizo products, visit paizo.com.

## Installation

The package is available through the [module registry](https://foundryvtt.com/packages/pf2e-qftff-tools)

### Git

Clone this repository into your installation's module folder:

    cd ~/.local/share/FoundryVTT/Data/modules
    git clone https://github.com/BernhardPosselt/pf2e-qftff-tools.git 
    yarn install
    yarn run build

Activate the module in FoundryVTT.

## Provides


### Macros

* A macro to roll random encounters for Burning Tundra
  
  ![Macro](./docs/img/burning-tundra-random-encounter-macro.png)

* A macro to check off random encounters for Burning Tundra that should only happen once

  ![Macro](./docs/img/encounter-checklist.png)

* A macro to roll random encounters from the GMG

  ![Macro](./docs/img/hexploration-random-encounter-macro.png)

* A macro to roll Shadow Plane encounters

* A macro to toggle weather on/off to change into non exposed areas
 
* A macro to advance/retract to a certain day of time

### Daily Weather

Rolls daily weather, animates weather on maps and starts playlists.

Visual effects rely on [FxMaster](https://foundryvtt.com/packages/fxmaster).

First configure the **Weather Roll Table** in settings. The name needs to be the same as an existing roll table in your game.

The roll table itself can have the following values:

* sunny
* rain
* heavyRain
* fog
* heavyFog
* storm
* snowfall
* snowstorm
* clouds

Then optionally create playlists with the name **weather.NAME**, where NAME is one of the roll table values, e.g. **weather.clouds** for clouds.

Each day, a new value is rolled from the roll table and persisted across all scenes.

### Maps

**Note**: This module does not include maps that are present in the PDF. It's expected that you use PDF2Foundry to import the PDFs to get the original maps. This module bundles all remaining maps that come up in various encounters but don't have a map which are a ton.

PS: I'm a developer first and foremost and my art skills are pretty bad ;)

* Book 1: not included, use [https://foundryvtt.com/packages/qftff-maps-remake](https://foundryvtt.com/packages/qftff-maps-remake) instead
* Book 2: complete
* Book 3: complete
