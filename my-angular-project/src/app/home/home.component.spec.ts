import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { PostService } from '../post.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let postService: PostService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HttpClientTestingModule],
      providers: [PostService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create the HomeComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit and fetch posts', () => {
    const mockPosts = [
      { id: 1, title: 'Post 1', body: 'Post body' },
      { id: 2, title: 'Post 2', body: 'Another post body' }
    ];

    spyOn(postService, 'getPosts').and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(postService.getPosts).toHaveBeenCalled();
    expect(component.posts).toEqual(mockPosts);
    expect(component.filteredPosts).toEqual(mockPosts);
  });

  it('should filter posts correctly', () => {
    const mockPosts = [
      { id: 1, title: 'Post 1', body: 'Post body' },
      { id: 2, title: 'Post 2', body: 'Another post body' }
    ];
    component.posts = mockPosts;
    component.searchForLocalQuery = 'Post 1';
    component.filterPosts();

    expect(component.filteredPosts.length).toBe(1);
    expect(component.filteredPosts[0].title).toBe('Post 1');
  });

  it('should load comments when showComments is called', () => {
    const postId = 1;
    const mockComments = [
      { postId: 1, id: 1, name: 'Comment 1', email: 'email@example.com', body: 'This is a comment' }
    ];

    // Triggering the HTTP GET request
    component.showComments(postId);

    // Expecting the HTTP request made by `showComments`
    const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
    expect(req.request.method).toBe('GET');

    // Respond with mock data
    req.flush(mockComments);

    // Verifying the result
    expect(component.commentsByPost[postId]).toEqual(mockComments);
  });

  it('should check if "rerum" exists in text', () => {
    const result = component.hasRerum('This is a test with rerum');
    expect(result).toBeTrue();

    const resultFalse = component.hasRerum('This is a test without the keyword');
    expect(resultFalse).toBeFalse();
  });

  it('should bold "rerum" in the text', () => {
    const result = component.boldtheWordOfRerum('This is a test with rerum');
    expect(result).toBe('This is a test with <strong>rerum</strong>');

    const resultFalse = component.boldtheWordOfRerum('This is a test without the keyword');
    expect(resultFalse).toBe('This is a test without the keyword');
  });

  afterEach(() => {
    httpMock.verify(); // Verifying that there are no outstanding HTTP requests
  });
});
