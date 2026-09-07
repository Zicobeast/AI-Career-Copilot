from fastapi import APIRouter, HTTPException, status
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chatbot import get_chat_response

router = APIRouter(prefix="/api/chat", tags=["Career Assistant"])


@router.post("", response_model=ChatResponse, status_code=status.HTTP_200_OK)
def chat_with_copilot(request: ChatRequest) -> ChatResponse:
    """
    Context-aware career advice endpoint.
    Accepts candidate profile context, conversation history, and query message.
    Dispatches to Gemini API if configured or deterministic rule-based fallback.
    """
    try:
        return get_chat_response(
            message=request.message,
            history=request.history,
            context=request.context,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate career assistant response: {str(e)}",
        )


@router.get("/demo", response_model=ChatResponse, summary="Fetch demo career assistant greeting")
def get_demo_chat() -> ChatResponse:
    """
    Returns initial deterministic evaluation greeting and suggested follow-ups
    for the sample candidate Alex Johnson.
    """
    return get_chat_response(
        message="Hello! I'm reviewing my roadmap.",
        history=[],
        context=None
    )

