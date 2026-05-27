'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ctfast documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AdminAudit.html" data-type="entity-link" >AdminAudit</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminChallenges.html" data-type="entity-link" >AdminChallenges</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminContestPage.html" data-type="entity-link" >AdminContestPage</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminInstances.html" data-type="entity-link" >AdminInstances</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminLayout.html" data-type="entity-link" >AdminLayout</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminOverview.html" data-type="entity-link" >AdminOverview</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminSolves.html" data-type="entity-link" >AdminSolves</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminTeams.html" data-type="entity-link" >AdminTeams</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminUsers.html" data-type="entity-link" >AdminUsers</a>
                            </li>
                            <li class="link">
                                <a href="components/App.html" data-type="entity-link" >App</a>
                            </li>
                            <li class="link">
                                <a href="components/ChallengeInstancePanel.html" data-type="entity-link" >ChallengeInstancePanel</a>
                            </li>
                            <li class="link">
                                <a href="components/ChallengeModal.html" data-type="entity-link" >ChallengeModal</a>
                            </li>
                            <li class="link">
                                <a href="components/ChallengePreview.html" data-type="entity-link" >ChallengePreview</a>
                            </li>
                            <li class="link">
                                <a href="components/Challenges.html" data-type="entity-link" >Challenges</a>
                            </li>
                            <li class="link">
                                <a href="components/EditMeModal.html" data-type="entity-link" >EditMeModal</a>
                            </li>
                            <li class="link">
                                <a href="components/EditTeamModal.html" data-type="entity-link" >EditTeamModal</a>
                            </li>
                            <li class="link">
                                <a href="components/Footer.html" data-type="entity-link" >Footer</a>
                            </li>
                            <li class="link">
                                <a href="components/Header.html" data-type="entity-link" >Header</a>
                            </li>
                            <li class="link">
                                <a href="components/Layout.html" data-type="entity-link" >Layout</a>
                            </li>
                            <li class="link">
                                <a href="components/Login.html" data-type="entity-link" >Login</a>
                            </li>
                            <li class="link">
                                <a href="components/MainPage.html" data-type="entity-link" >MainPage</a>
                            </li>
                            <li class="link">
                                <a href="components/Me.html" data-type="entity-link" >Me</a>
                            </li>
                            <li class="link">
                                <a href="components/NewTeamPage.html" data-type="entity-link" >NewTeamPage</a>
                            </li>
                            <li class="link">
                                <a href="components/RatingPage.html" data-type="entity-link" >RatingPage</a>
                            </li>
                            <li class="link">
                                <a href="components/Register.html" data-type="entity-link" >Register</a>
                            </li>
                            <li class="link">
                                <a href="components/ScoreboardChart.html" data-type="entity-link" >ScoreboardChart</a>
                            </li>
                            <li class="link">
                                <a href="components/TeamPage.html" data-type="entity-link" >TeamPage</a>
                            </li>
                            <li class="link">
                                <a href="components/TeamsListPage.html" data-type="entity-link" >TeamsListPage</a>
                            </li>
                            <li class="link">
                                <a href="components/UserPage.html" data-type="entity-link" >UserPage</a>
                            </li>
                            <li class="link">
                                <a href="components/UsersListPage.html" data-type="entity-link" >UsersListPage</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AdminApi.html" data-type="entity-link" >AdminApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApiConfig.html" data-type="entity-link" >ApiConfig</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthApi.html" data-type="entity-link" >AuthApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChallengesApi.html" data-type="entity-link" >ChallengesApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClientConfig.html" data-type="entity-link" >ClientConfig</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MeApi.html" data-type="entity-link" >MeApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ScoreboardApi.html" data-type="entity-link" >ScoreboardApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TeamApi.html" data-type="entity-link" >TeamApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TranslocoHttpLoader.html" data-type="entity-link" >TranslocoHttpLoader</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersApi.html" data-type="entity-link" >UsersApi</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AdminAuditLog.html" data-type="entity-link" >AdminAuditLog</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminAuditLogListResponse.html" data-type="entity-link" >AdminAuditLogListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminChallenge.html" data-type="entity-link" >AdminChallenge</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminChallengeListResponse.html" data-type="entity-link" >AdminChallengeListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminChallengeResponse.html" data-type="entity-link" >AdminChallengeResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminConfirmRequest.html" data-type="entity-link" >AdminConfirmRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminContest.html" data-type="entity-link" >AdminContest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminContestResponse.html" data-type="entity-link" >AdminContestResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminContestUpdateRequest.html" data-type="entity-link" >AdminContestUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminCreateChallengeRequest.html" data-type="entity-link" >AdminCreateChallengeRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminDeleteUserResponse.html" data-type="entity-link" >AdminDeleteUserResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminInstance.html" data-type="entity-link" >AdminInstance</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminInstanceListResponse.html" data-type="entity-link" >AdminInstanceListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminInstanceResponse.html" data-type="entity-link" >AdminInstanceResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminInstanceStatusRequest.html" data-type="entity-link" >AdminInstanceStatusRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminInstanceTTLRequest.html" data-type="entity-link" >AdminInstanceTTLRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminOverviewResponse.html" data-type="entity-link" >AdminOverviewResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminSolve.html" data-type="entity-link" >AdminSolve</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminSolveListResponse.html" data-type="entity-link" >AdminSolveListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminStats.html" data-type="entity-link" >AdminStats</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminTeam.html" data-type="entity-link" >AdminTeam</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminTeamListResponse.html" data-type="entity-link" >AdminTeamListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminUpdateChallengeRequest.html" data-type="entity-link" >AdminUpdateChallengeRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminUser.html" data-type="entity-link" >AdminUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminUserListResponse.html" data-type="entity-link" >AdminUserListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminUserResponse.html" data-type="entity-link" >AdminUserResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChallengeAccess.html" data-type="entity-link" >ChallengeAccess</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChallengeAccessResponse.html" data-type="entity-link" >ChallengeAccessResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChallengeInstance.html" data-type="entity-link" >ChallengeInstance</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChallengeInstanceResponse.html" data-type="entity-link" >ChallengeInstanceResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChallengeInterface.html" data-type="entity-link" >ChallengeInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChallengeLogEntry.html" data-type="entity-link" >ChallengeLogEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChallengeLogsResponse.html" data-type="entity-link" >ChallengeLogsResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChallengePreviewInterface.html" data-type="entity-link" >ChallengePreviewInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChallengePreviewsInterface.html" data-type="entity-link" >ChallengePreviewsInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChallengeResponseInterface.html" data-type="entity-link" >ChallengeResponseInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChallengeStatusResponse.html" data-type="entity-link" >ChallengeStatusResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChallengeSubmitResponseInterface.html" data-type="entity-link" >ChallengeSubmitResponseInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateTeamInterface.html" data-type="entity-link" >CreateTeamInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteResponse.html" data-type="entity-link" >DeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InstanceStatusView.html" data-type="entity-link" >InstanceStatusView</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JoinTeamInterface.html" data-type="entity-link" >JoinTeamInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LeaderboardEntry.html" data-type="entity-link" >LeaderboardEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LeaderboardFreezeResponse.html" data-type="entity-link" >LeaderboardFreezeResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LeaderboardResponseInterface.html" data-type="entity-link" >LeaderboardResponseInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LeaderboardSolve.html" data-type="entity-link" >LeaderboardSolve</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LeaderboardSolveInterface.html" data-type="entity-link" >LeaderboardSolveInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LeaderboardTeamInterface.html" data-type="entity-link" >LeaderboardTeamInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginInterface.html" data-type="entity-link" >LoginInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginResponseInterface.html" data-type="entity-link" >LoginResponseInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MeInterface.html" data-type="entity-link" >MeInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MemberBadge.html" data-type="entity-link" >MemberBadge</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MemberTableItem.html" data-type="entity-link" >MemberTableItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RatingTeamTableItem.html" data-type="entity-link" >RatingTeamTableItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterInterface.html" data-type="entity-link" >RegisterInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScoreboardChartSolve.html" data-type="entity-link" >ScoreboardChartSolve</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScoreboardChartTeam.html" data-type="entity-link" >ScoreboardChartTeam</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScoreboardTopResponseInterface.html" data-type="entity-link" >ScoreboardTopResponseInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScoreboardTopSolveInterface.html" data-type="entity-link" >ScoreboardTopSolveInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScoreboardTopTeamInterface.html" data-type="entity-link" >ScoreboardTopTeamInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamDashboardInterface.html" data-type="entity-link" >TeamDashboardInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamInterface.html" data-type="entity-link" >TeamInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamMembersInterface.html" data-type="entity-link" >TeamMembersInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamPageData.html" data-type="entity-link" >TeamPageData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamPageResponse.html" data-type="entity-link" >TeamPageResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamResponseInterface.html" data-type="entity-link" >TeamResponseInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamSolveInterface.html" data-type="entity-link" >TeamSolveInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamSolvesResponseInterface.html" data-type="entity-link" >TeamSolvesResponseInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamSolvesSummaryInterface.html" data-type="entity-link" >TeamSolvesSummaryInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamsResponseInterface.html" data-type="entity-link" >TeamsResponseInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamTableItem.html" data-type="entity-link" >TeamTableItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateMeInterface.html" data-type="entity-link" >UpdateMeInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateTeamInterface.html" data-type="entity-link" >UpdateTeamInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserInterface.html" data-type="entity-link" >UserInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserPageData.html" data-type="entity-link" >UserPageData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserResponseInterface.html" data-type="entity-link" >UserResponseInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserSeed.html" data-type="entity-link" >UserSeed</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UsersInterface.html" data-type="entity-link" >UsersInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/userTableItem.html" data-type="entity-link" >userTableItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserTeam.html" data-type="entity-link" >UserTeam</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});