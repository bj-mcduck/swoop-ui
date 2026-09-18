require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "homepage renders the Swoop concept" do
    get root_url
    assert_response :success
    assert_select "h1", text: /Improving patient outcomes/
    assert_select "[data-controller='tabs']"
    assert_select ".solution-card", minimum: 7
  end


  test "all public pages survive navigation and reload" do
    [root_url, about_url, solutions_url, root_url].each do |url|
      get url
      assert_response :success
    end
  end
end
