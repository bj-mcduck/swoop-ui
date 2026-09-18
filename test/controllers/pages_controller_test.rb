require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "homepage renders the Swoop concept" do
    get root_url
    assert_response :success
    assert_select "h1", text: /Improving patient outcomes/
    assert_select ".hero-story", count: 3
    assert_select ".hero-story .eyebrow", count: 0
    assert_select ".hero-story button", count: 3
    assert_select ".team-card", count: 9
    assert_select ".team-card img", count: 9
    assert_select ".team-card button", count: 0
    assert_select ".team-card img[src^='/images/characters/']", count: 9
    assert_select "#solutions, #privacy, #insights", count: 0
    assert_select "a[href^='https:']", count: 0
  end


  test "all public pages survive navigation and reload" do
    [root_url, about_url, solutions_url, root_url].each do |url|
      get url
      assert_response :success
    end
  end
end
